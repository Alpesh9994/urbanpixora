import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-testimonials-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './testimonials-section.html',
    styleUrl: './testimonials-section.scss'
})
export class TestimonialsSectionComponent {
    readonly testimonials = [
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
    activeIndex = 0;

    prev() {
        this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
    next() {
        this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
    }
}
