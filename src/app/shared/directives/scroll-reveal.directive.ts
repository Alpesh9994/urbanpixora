import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

/**
 * [scrollReveal] — uses IntersectionObserver to animate elements into view.
 * Usage:  <div scrollReveal>
 *         <div scrollReveal revealFrom="left" [revealDelay]="200">
 *
 * Key fix: We wait one RAF before applying `sr-hidden` so that elements that
 * are already visible on the first paint are NOT hidden during route transitions.
 */
@Directive({
    selector: '[scrollReveal]',
    standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
    @Input() revealDelay = 0;
    @Input() revealFrom: 'up' | 'left' | 'right' | 'fade' = 'up';

    private observer!: IntersectionObserver;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnInit() {
        const el = this.el.nativeElement;

        if (this.revealDelay) {
            el.style.transitionDelay = `${this.revealDelay}ms`;
        }

        // Use a double-rAF to give the browser TWO paint cycles before hiding.
        // This prevents elements that are already in the viewport on first render
        // from ever flashing invisible during navigation or first load.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Check if element is already intersecting BEFORE hiding it
                const rect = el.getBoundingClientRect();
                const alreadyVisible =
                    rect.top < window.innerHeight && rect.bottom > 0;

                if (!alreadyVisible) {
                    // Only hide elements that are genuinely off-screen
                    el.classList.add('sr-hidden', `sr-from-${this.revealFrom}`);
                }

                this.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    el.classList.remove('sr-hidden');
                                    el.classList.add('revealed');
                                }, 0);
                                this.observer.unobserve(el);
                            }
                        });
                    },
                    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
                );
                this.observer.observe(el);
            });
        });
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }
}
