import { Injectable, OnDestroy, NgZone } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
    private lenis: Lenis | null = null;
    private rafId: number | null = null;

    constructor(private ngZone: NgZone) { }

    /** Call once from AppComponent.ngOnInit */
    init() {
        // Run Lenis outside Angular's zone so change detection isn't triggered on every frame
        this.ngZone.runOutsideAngular(() => {
            this.lenis = new Lenis({
                duration: 1.2,             // scroll animation duration (seconds)
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.9,
                touchMultiplier: 1.5,
                infinite: false,
            });

            const raf = (time: number) => {
                this.lenis!.raf(time);
                this.rafId = requestAnimationFrame(raf);
            };
            this.rafId = requestAnimationFrame(raf);
        });
    }

    /** Scroll to an element or position */
    scrollTo(target: string | HTMLElement | number, offset = 0) {
        this.lenis?.scrollTo(target, { offset });
    }

    /** Jump to top instantly on every route change.
     *  Stops Lenis, native-scrolls to 0, then restarts Lenis so its
     *  internal scroll position stays in sync with the window.
     */
    scrollToTop() {
        if (!this.lenis) {
            window.scrollTo(0, 0);
            return;
        }
        // Stop the Lenis rAF loop temporarily
        this.lenis.stop();
        // Jump the native scroll position to the very top
        window.scrollTo({ top: 0, behavior: 'instant' });
        // Let one frame pass so Lenis picks up the new position, then restart
        requestAnimationFrame(() => {
            this.lenis?.start();
        });
    }

    /**
     * Force Lenis to recalculate the scrollable content height.
     * Must be called after Angular finishes rendering a new route — otherwise
     * Lenis keeps the old page height and stops scrolling prematurely.
     */
    resize() {
        this.lenis?.resize();
    }

    ngOnDestroy() {
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.lenis?.destroy();
    }
}
