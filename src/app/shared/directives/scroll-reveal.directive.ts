import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

/**
 * [scrollReveal] — uses IntersectionObserver to animate elements into view.
 * Usage:  <div scrollReveal>
 *         <div scrollReveal revealFrom="left" [revealDelay]="200">
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

        // Set initial hidden state immediately
        el.classList.add('sr-hidden', `sr-from-${this.revealFrom}`);
        if (this.revealDelay) {
            el.style.transitionDelay = `${this.revealDelay}ms`;
        }

        // Defer observer creation so already-visible elements DON'T get stuck hidden.
        // requestAnimationFrame waits for the browser's first paint before observing.
        requestAnimationFrame(() => {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Small timeout honours the transition-delay stagger
                            setTimeout(() => {
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
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }
}
