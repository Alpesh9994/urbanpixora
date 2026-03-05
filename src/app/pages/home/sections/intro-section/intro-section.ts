import {
    Component, ElementRef, ViewChild,
    AfterViewInit, OnDestroy, NgZone
} from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-intro-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './intro-section.html',
    styleUrl: './intro-section.scss'
})
export class IntroSectionComponent implements AfterViewInit, OnDestroy {
    @ViewChild('sequenceCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private readonly totalFrames = 96;
    private readonly startFrameOffset = 15;           // skip pre-lit frames 1-14
    private readonly frameCount = this.totalFrames - this.startFrameOffset + 1; // 82

    private images: HTMLImageElement[] = [];
    private currentFrame = -1;
    private ctx!: CanvasRenderingContext2D;

    // Cached canvas dimensions — updated only on resize, never on scroll
    private cachedW = 0;
    private cachedH = 0;

    private rafPending = false;
    private scrollHandler?: () => void;
    private resizeObserver?: ResizeObserver;

    constructor(
        private el: ElementRef,
        private ngZone: NgZone
    ) {
        this.preloadImages();
    }

    // ─── Preload ───────────────────────────────────────────────────────────────
    private preloadImages() {
        for (let i = 0; i < this.frameCount; i++) {
            const img = new Image();
            img.src = `/who-we-are-sequence/frame-${i + this.startFrameOffset}.webp`;
            this.images.push(img);
        }
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────────────
    ngAfterViewInit() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;

        // Draw frame 0 immediately
        this.images[0].complete
            ? this.renderFrame(0)
            : (this.images[0].onload = () => this.renderFrame(0));

        this.ngZone.runOutsideAngular(() => {
            // rAF-throttled scroll listener
            this.scrollHandler = () => {
                if (this.rafPending) return;
                this.rafPending = true;
                requestAnimationFrame(() => {
                    this.onScroll();
                    this.rafPending = false;
                });
            };
            window.addEventListener('scroll', this.scrollHandler, { passive: true });

            // Re-render current frame on any canvas resize (fixes blank after nav / resize)
            this.resizeObserver = new ResizeObserver(() => {
                // Update cached bounds on resize (not on scroll)
                const bounds = canvas.getBoundingClientRect();
                this.cachedW = bounds.width;
                this.cachedH = bounds.height;
                if (this.currentFrame >= 0) {
                    this.renderFrame(this.currentFrame);
                }
            });
            this.resizeObserver.observe(canvas);

            // Capture initial bounds after first render
            requestAnimationFrame(() => {
                const bounds = canvas.getBoundingClientRect();
                this.cachedW = bounds.width;
                this.cachedH = bounds.height;
            });

            this.onScroll(); // bootstrap
        });
    }

    // ─── Scroll math ───────────────────────────────────────────────────────────
    private onScroll() {
        if (!this.ctx || !this.images.length) return;

        const section = this.el.nativeElement as HTMLElement;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;

        if (rect.bottom < 0 || rect.top > vh) return;

        // ── Progress design:
        //   0  → section center is at the BOTTOM of the viewport
        //        i.e. sectionCenter = vh  →  rect.top = vh - height/2
        //   1  → section center is at the CENTER of the viewport
        //        i.e. sectionCenter = vh/2 → rect.top = vh/2 - height/2
        //
        //  This guarantees:
        //  • Animation begins the moment more than half the section is visible
        //  • Animation completes when the section sits perfectly centered
        //  • Works the same across all screen/section sizes
        const sectionCenter = rect.top + rect.height / 2;
        const startY = vh;          // center at viewport BOTTOM
        const endY = vh / 2;     // center at viewport MIDDLE

        let progress = (startY - sectionCenter) / (startY - endY);
        progress = Math.max(0, Math.min(1, progress));

        const targetFrame = Math.min(
            Math.floor(progress * (this.frameCount - 1)),
            this.frameCount - 1
        );

        if (targetFrame === this.currentFrame) return;
        this.currentFrame = targetFrame;

        const img = this.images[targetFrame];
        if (img.complete) {
            this.renderFrame(targetFrame);
        } else {
            img.onload = () => {
                if (targetFrame === this.currentFrame) {
                    this.renderFrame(targetFrame);
                }
            };
        }
    }

    // ─── Canvas drawing: object-fit cover + HD ─────────────────────────────────
    private renderFrame(frameIndex: number) {
        const img = this.images[frameIndex];
        const canvas = this.canvasRef.nativeElement;

        if (!img || img.width === 0 || img.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        // Use cached bounds — avoids getBoundingClientRect() on every scroll
        const cw = this.cachedW;
        const ch = this.cachedH;

        if (cw === 0 || ch === 0) return;

        const tw = Math.round(cw * dpr);
        const th = Math.round(ch * dpr);

        if (canvas.width !== tw || canvas.height !== th) {
            canvas.width = tw;
            canvas.height = th;
        }

        const cRatio = tw / th;
        const iRatio = img.width / img.height;

        let dw = tw, dh = th, dx = 0, dy = 0;
        if (cRatio > iRatio) {
            dh = tw / iRatio;
            dy = (th - dh) / 2;
        } else {
            dw = th * iRatio;
            dx = (tw - dw) / 2;
        }

        this.ctx.clearRect(0, 0, tw, th);
        this.ctx.drawImage(img, dx, dy, dw, dh);
    }

    // ─── Cleanup ───────────────────────────────────────────────────────────────
    ngOnDestroy() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        this.resizeObserver?.disconnect();
    }
}
