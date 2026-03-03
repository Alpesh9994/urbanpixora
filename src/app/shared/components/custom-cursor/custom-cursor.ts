import {
  Component, OnInit, OnDestroy,
  ElementRef, NgZone, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.scss'
})
export class CustomCursorComponent implements OnInit, OnDestroy {

  private dot!: HTMLElement;
  private ring!: HTMLElement;

  // Exact cursor position
  private mouseX = -200;
  private mouseY = -200;

  // Ring's current smoothed position
  private ringX = -200;
  private ringY = -200;

  private rafId = 0;
  private isBrowser: boolean;
  private removers: (() => void)[] = [];

  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const host = this.elRef.nativeElement as HTMLElement;
    this.dot = host.querySelector('.cursor__dot')!;
    this.ring = host.querySelector('.cursor__ring')!;

    this.zone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Dot snaps instantly
        this.dot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      };

      const onDown = () => {
        document.body.classList.add('cursor-click');
      };
      const onUp = () => document.body.classList.remove('cursor-click');

      const onEnter = () => document.body.classList.add('cursor-hover');
      const onLeave = () => document.body.classList.remove('cursor-hover');
      const sel = 'a,button,[role="button"],input,label,select,textarea,[tabindex]';
      const attachHover = () =>
        document.querySelectorAll<HTMLElement>(sel).forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
      attachHover();
      const obs = new MutationObserver(() => attachHover());
      obs.observe(document.body, { childList: true, subtree: true });

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mousedown', onDown);
      document.addEventListener('mouseup', onUp);

      // Ring follows with smooth lerp — "magnetic" lag
      const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
      const EASE = 0.13; // lower = more lag, higher = snappier (0.08–0.2 is sweet spot)

      const animate = () => {
        this.ringX = lerp(this.ringX, this.mouseX, EASE);
        this.ringY = lerp(this.ringY, this.mouseY, EASE);
        this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;
        this.rafId = requestAnimationFrame(animate);
      };
      this.rafId = requestAnimationFrame(animate);

      this.removers.push(
        () => document.removeEventListener('mousemove', onMove),
        () => document.removeEventListener('mousedown', onDown),
        () => document.removeEventListener('mouseup', onUp),
        () => obs.disconnect(),
        () => cancelAnimationFrame(this.rafId)
      );
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cursor-hover', 'cursor-click');
    this.removers.forEach(fn => fn());
  }
}
