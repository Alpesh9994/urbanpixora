import {
  Component, OnInit, OnDestroy,
  ElementRef, NgZone, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ── Tuning constants ──────────────────────────────────────────
const COUNT = 150;   // more particles = less gaps near cursor
const Z1 = 80;    // inner zone edge  — brightest
const Z2 = 180;   // mid  zone edge   — medium glow
const Z3 = 300;   // outer zone edge  — soft fade
const OPACITY_BASE = 0.05;  // default almost-invisible state
const VEL_THRESHOLD = 8;     // px/frame to trigger wave

// Brand blue shades
const COLOURS = [
  '41,121,255',   // #2979ff
  '22, 94,217',   // #165ed9
  '83,152,255',   // #5398ff
  '41,121,255',   // repeated for weight
  '100,181,246',  // softer sky
];

interface Fly {
  el: HTMLElement;
  x: number; y: number;         // current screen position
  baseX: number; baseY: number; // drift centre
  phaseX: number; phaseY: number;
  speedX: number; speedY: number;
  ampX: number; ampY: number;
  size: number;
  rgb: string;
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
  private mouseX = -9999; private mouseY = -9999;
  private prevX = -9999; private prevY = -9999;
  private rafId = 0;
  private isBrowser: boolean;
  private listeners: (() => void)[] = [];

  // Wave throttle: don't spawn >1 wave per 200ms
  private lastWaveMs = 0;

  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) { this.isBrowser = isPlatformBrowser(platformId); }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.headEl = this.elRef.nativeElement.querySelector('.cursor__head');
    const host = this.elRef.nativeElement as HTMLElement;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (let i = 0; i < COUNT; i++) {
      const rgb = COLOURS[Math.floor(Math.random() * COLOURS.length)];
      const size = rnd(2.5, 7);
      const pulse = rnd(3, 6.5).toFixed(1);

      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed; top:0; left:0;
        width:${size}px; height:${size}px;
        border-radius:50%;
        pointer-events:none;
        transform:translate(-50%,-50%);
        z-index:${99900 + i};
        will-change:opacity,box-shadow;
        opacity:${OPACITY_BASE};
        background:rgba(${rgb},0.9);
        box-shadow:none;
        transition:opacity 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        animation:particlePulse ${pulse}s ease-in-out infinite;
        animation-delay:-${rnd(0, parseFloat(pulse)).toFixed(2)}s;
      `;
      host.appendChild(el);

      this.flies.push({
        el, rgb, size,
        x: rnd(0, vw), y: rnd(0, vh),
        baseX: rnd(20, vw - 20), baseY: rnd(20, vh - 20),
        phaseX: rnd(0, Math.PI * 2), phaseY: rnd(0, Math.PI * 2),
        speedX: rnd(0.04, 0.10), speedY: rnd(0.04, 0.10),
        ampX: rnd(5, 25), ampY: rnd(5, 22),
      });
    }

    this.zone.runOutsideAngular(() => {
      // ── Mouse tracking ────────────────────────────────────────
      const onMove = (e: MouseEvent) => {
        this.prevX = this.mouseX; this.prevY = this.mouseY;
        this.mouseX = e.clientX; this.mouseY = e.clientY;
        this.headEl.style.left = e.clientX + 'px';
        this.headEl.style.top = e.clientY + 'px';
      };
      // ── Click ripple ─────────────────────────────────────────
      const onDown = (e: MouseEvent) => {
        document.body.classList.add('cursor-click');
        this.spawnRipple(e.clientX, e.clientY, true);
      };
      const onUp = () => document.body.classList.remove('cursor-click');

      // ── Hover glow on interactive elements ───────────────────
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

      // ── RAF loop ──────────────────────────────────────────────
      const Z1sq = Z1 * Z1, Z2sq = Z2 * Z2, Z3sq = Z3 * Z3;
      let t = 0; // RAF time accumulator

      const loop = (now: number) => {
        t += 0.007;

        // Check velocity → spawn wave if cursor moving fast
        const vx = this.mouseX - this.prevX;
        const vy = this.mouseY - this.prevY;
        const vel = Math.sqrt(vx * vx + vy * vy);
        if (vel > VEL_THRESHOLD && now - this.lastWaveMs > 200) {
          this.lastWaveMs = now;
          this.spawnRipple(this.mouseX, this.mouseY, false);
        }
        this.prevX = this.mouseX; this.prevY = this.mouseY;

        for (const fly of this.flies) {
          // Subtle sinusoidal float
          fly.x = fly.baseX + Math.cos(t * fly.speedX + fly.phaseX) * fly.ampX;
          fly.y = fly.baseY + Math.sin(t * fly.speedY + fly.phaseY) * fly.ampY;
          fly.el.style.left = fly.x + 'px';
          fly.el.style.top = fly.y + 'px';

          const dx = fly.x - this.mouseX;
          const dy = fly.y - this.mouseY;
          const dSq = dx * dx + dy * dy; // distanceSq — no sqrt needed for zone check

          if (dSq > Z3sq) {
            // ── Far: near-invisible ──
            fly.el.style.opacity = String(OPACITY_BASE);
            fly.el.style.boxShadow = 'none';
            fly.el.style.background = `rgba(${fly.rgb},0.85)`;
          } else {
            const dist = Math.sqrt(dSq);

            // Smoothstep helper
            const ss = (x: number) => x * x * (3 - 2 * x);

            let strength: number;
            if (dSq < Z1sq) {
              // Zone 1 — inner bright core
              strength = ss(1 - dist / Z1 * 0.15); // near-1, slight centre dip
            } else if (dSq < Z2sq) {
              // Zone 2 — medium glow ring
              const raw = 1 - (dist - Z1) / (Z2 - Z1);
              strength = ss(raw) * 0.75;
            } else {
              // Zone 3 — outer soft fade
              const raw = 1 - (dist - Z2) / (Z3 - Z2);
              strength = ss(raw) * 0.35;
            }

            const gInner = fly.size * (1.5 + strength * 5);
            const gOuter = fly.size * (3 + strength * 12);
            const opacity = (OPACITY_BASE + strength * (1 - OPACITY_BASE)).toFixed(3);

            fly.el.style.opacity = opacity;
            fly.el.style.background =
              `radial-gradient(circle,` +
              `rgba(255,255,255,${(strength * 0.65).toFixed(2)}) 0%,` +
              `rgba(${fly.rgb},${(0.7 + strength * 0.3).toFixed(2)}) 45%,` +
              `rgba(${fly.rgb},0.05) 80%,transparent 100%)`;
            fly.el.style.boxShadow =
              `0 0 ${gInner}px ${(fly.size * 0.6).toFixed(1)}px rgba(${fly.rgb},${(strength * 0.85).toFixed(2)}),` +
              `0 0 ${gOuter}px ${(fly.size * 2.5).toFixed(1)}px rgba(${fly.rgb},${(strength * 0.22).toFixed(2)})`;
          }
        }

        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);

      this.listeners.push(
        () => document.removeEventListener('mousemove', onMove),
        () => document.removeEventListener('mousedown', onDown),
        () => document.removeEventListener('mouseup', onUp),
        () => obs.disconnect(),
        () => cancelAnimationFrame(this.rafId)
      );
    });
  }

  /** Spawn expanding ripple rings.  isClick = larger, more rings */
  private spawnRipple(x: number, y: number, isClick: boolean): void {
    const count = isClick ? 3 : 1;
    const maxSize = isClick ? 240 : 160;
    const baseAlpha = isClick ? 0.7 : 0.4;

    for (let i = 0; i < count; i++) {
      const ring = document.createElement('div');
      const dur = (isClick ? 700 : 550) + i * 130;
      ring.style.cssText = `
        position:fixed;
        left:${x}px; top:${y}px;
        width:0; height:0;
        border-radius:50%;
        border: ${isClick ? 1.5 : 1}px solid rgba(41,121,255,${(baseAlpha - i * 0.18).toFixed(2)});
        transform:translate(-50%,-50%);
        pointer-events:none;
        z-index:99960;
        animation:waveExpand ${dur}ms cubic-bezier(0.1,0.5,0.3,1) ${i * 90}ms forwards;
      `;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), dur + i * 90 + 100);
    }

    // Subtle radial gradient flash at centre
    if (isClick) {
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:fixed;
        left:${x}px; top:${y}px;
        width:0; height:0;
        border-radius:50%;
        background:radial-gradient(circle,rgba(41,121,255,0.22) 0%,transparent 70%);
        transform:translate(-50%,-50%);
        pointer-events:none;
        z-index:99959;
        animation:flashExpand 600ms ease-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 700);
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cursor-hover', 'cursor-click');
    this.listeners.forEach(fn => fn());
    this.flies.forEach(f => f.el.remove());
    this.flies = [];
  }
}
