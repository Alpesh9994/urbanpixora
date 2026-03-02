import {
  Component, OnInit, OnDestroy,
  ElementRef, NgZone, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const COUNT = 35;          // spread across full page
const GLOW_COUNT = 2;           // only nearest 2 glow bright
const GLOW_RADIUS = 160;         // proximity radius
const LIGHT = '41,121,255';
const DARK = '22,94,217';

interface Fly {
  el: HTMLElement;
  x: number; y: number;
  baseX: number; baseY: number;
  phaseX: number; phaseY: number;
  speedX: number; speedY: number;
  ampX: number; ampY: number;
  size: number;
}

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.scss'
})
export class CustomCursorComponent implements OnInit, OnDestroy {

  private headEl!: HTMLElement;
  private flies: Fly[] = [];
  private mouseX = -9999;
  private mouseY = -9999;
  private rafId = 0;
  private isBrowser: boolean;
  private listeners: (() => void)[] = [];

  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.headEl = this.elRef.nativeElement.querySelector('.cursor__head');
    const host = this.elRef.nativeElement as HTMLElement;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      const rgb = i % 2 === 0 ? LIGHT : DARK;
      const size = Math.round(rnd(3, 7));

      el.style.cssText = `
        position:fixed; top:0; left:0;
        width:${size}px; height:${size}px;
        border-radius:50%;
        pointer-events:none;
        transform:translate(-50%,-50%);
        mix-blend-mode:screen;
        will-change:left,top;
        z-index:${99970 + i};
        transition: opacity 0.6s ease, box-shadow 0.6s ease, background 0.6s ease;
        opacity:0.07;
        background:rgba(${rgb},0.5);
      `;
      host.appendChild(el);

      this.flies.push({
        el, size,
        x: rnd(0, vw), y: rnd(0, vh),
        baseX: rnd(80, vw - 80),
        baseY: rnd(80, vh - 80),
        phaseX: rnd(0, Math.PI * 2),
        phaseY: rnd(0, Math.PI * 2),
        speedX: rnd(0.1, 0.3),
        speedY: rnd(0.1, 0.3),
        ampX: rnd(50, 150),
        ampY: rnd(50, 130),
      });
    }

    this.zone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.headEl.style.left = e.clientX + 'px';
        this.headEl.style.top = e.clientY + 'px';
      };
      const onDown = () => document.body.classList.add('cursor-click');
      const onUp = () => document.body.classList.remove('cursor-click');
      const onEnter = () => document.body.classList.add('cursor-hover');
      const onLeave = () => document.body.classList.remove('cursor-hover');
      const sel = 'a,button,[role="button"],input,label,select,textarea,[tabindex]';
      const attachHover = () =>
        document.querySelectorAll<HTMLElement>(sel).forEach(e => {
          e.addEventListener('mouseenter', onEnter);
          e.addEventListener('mouseleave', onLeave);
        });
      attachHover();
      const obs = new MutationObserver(() => attachHover());
      obs.observe(document.body, { childList: true, subtree: true });
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mousedown', onDown);
      document.addEventListener('mouseup', onUp);

      let t = 0;
      const animate = () => {
        t += 0.007;

        // Drift each fly independently — no cursor involvement
        for (const fly of this.flies) {
          fly.x = fly.baseX + Math.cos(t * fly.speedX + fly.phaseX) * fly.ampX;
          fly.y = fly.baseY + Math.sin(t * fly.speedY + fly.phaseY) * fly.ampY;
          fly.el.style.left = fly.x + 'px';
          fly.el.style.top = fly.y + 'px';
        }

        // Sort by distance to cursor
        const sorted = this.flies
          .map((fly, i) => ({ fly, i, dist: Math.hypot(fly.x - this.mouseX, fly.y - this.mouseY) }))
          .sort((a, b) => a.dist - b.dist);

        sorted.forEach(({ fly, i, dist }, rank) => {
          const rgb = i % 2 === 0 ? LIGHT : DARK;

          if (rank < GLOW_COUNT && dist < GLOW_RADIUS) {
            // Smooth falloff: 1.0 at centre → 0.0 at GLOW_RADIUS
            const t2 = 1 - dist / GLOW_RADIUS;
            const opacity = (0.15 + t2 * 0.85).toFixed(2);
            const glow = fly.size * (2 + t2 * 4);
            fly.el.style.opacity = opacity;
            fly.el.style.background = `rgba(255,255,255,${(0.4 + t2 * 0.6).toFixed(2)})`;
            fly.el.style.boxShadow =
              `0 0 ${glow}px ${fly.size}px rgba(${rgb},${(t2 * 0.9).toFixed(2)}),` +
              `0 0 ${glow * 2}px ${fly.size * 2}px rgba(${rgb},${(t2 * 0.3).toFixed(2)})`;
          } else {
            // Very dim — barely visible
            fly.el.style.opacity = '0.06';
            fly.el.style.background = `rgba(${rgb},0.4)`;
            fly.el.style.boxShadow = 'none';
          }
        });

        this.rafId = requestAnimationFrame(animate);
      };
      this.rafId = requestAnimationFrame(animate);

      this.listeners.push(
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
    this.listeners.forEach(fn => fn());
    this.flies.forEach(f => f.el.remove());
    this.flies = [];
  }
}
