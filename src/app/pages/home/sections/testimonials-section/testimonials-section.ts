import { Component, signal, HostListener, Input, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { CmsSection } from '../../../../shared/services/cms.service';

@Component({
    selector: 'app-testimonials-section',
    standalone: true,
    imports: [ScrollRevealDirective, NgClass],
    templateUrl: './testimonials-section.html',
    styleUrl: './testimonials-section.scss',
})
export class TestimonialsSectionComponent {
    @Input() data: CmsSection | undefined;

    get testimonials() {
        return this.data?.items || [
            {
                quote: 'UrbanPixora transformed our digital identity from the ground up. The results exceeded every expectation — our conversions doubled in 3 months.',
                name: 'Arjun Mehta',
                role: 'CEO, Luminary Studio',
                initials: 'AM'
            },
            {
                quote: 'Their team\'s ability to blend strategy with stunning visuals is unmatched. Every pixel felt intentional and purposeful.',
                name: 'Priya Sharma',
                role: 'Head of Product, Nexus SaaS',
                initials: 'PS'
            },
            {
                quote: 'Working with UrbanPixora felt like having a world-class creative team embedded in our startup. Fast, brilliant, and deeply collaborative.',
                name: 'Rahul Desai',
                role: 'Founder, Vantage Fintech',
                initials: 'RD'
            },
        ];
    }

    activeIndex = 0;

    /**
     * Animation state machine:
     *  null           → resting (content visible)
     *  'exit-left'    → content slides out to the left  (Next clicked)
     *  'exit-right'   → content slides out to the right (Prev clicked)
     *  'enter-right'  → new content enters from the right (after Next exit)
     *  'enter-left'   → new content enters from the left  (after Prev exit)
     */
    readonly animState = signal<string | null>(null);

    private changeTo(newIndex: number, exitDir: 'left' | 'right'): void {
        if (this.animState() !== null) return; // debounce during animation

        // 1. Exit: slide out in the chosen direction
        this.animState.set(`exit-${exitDir}`);

        setTimeout(() => {
            // 2. Swap content while invisible
            this.activeIndex = newIndex;

            // 3. Enter: appear from the opposite side (no transition yet)
            const enterDir = exitDir === 'left' ? 'right' : 'left';
            this.animState.set(`enter-${enterDir}`);

            // 4. Two rAFs: let browser paint the enter position, then start the
            //    CSS transition back to the default (translateX(0), opacity 1)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.animState.set(null);
                });
            });
        }, 280);
    }

    prev(): void {
        this.changeTo(
            (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length,
            'right'
        );
    }

    next(): void {
        this.changeTo(
            (this.activeIndex + 1) % this.testimonials.length,
            'left'
        );
    }
    // ── Touch drag support (mobile swipe) ──────────────────────
    private touchStartX = 0;
    private readonly SWIPE_THRESHOLD = 50; // px

    @HostListener('touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {
        this.touchStartX = e.touches[0].clientX;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(e: TouchEvent) {
        const delta = e.changedTouches[0].clientX - this.touchStartX;
        if (Math.abs(delta) < this.SWIPE_THRESHOLD) return;
        delta < 0 ? this.next() : this.prev();
    }
}
