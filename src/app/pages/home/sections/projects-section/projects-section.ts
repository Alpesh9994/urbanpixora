import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-projects-section',
    standalone: true,
    imports: [RouterLink, ScrollRevealDirective],
    templateUrl: './projects-section.html',
    styleUrl: './projects-section.scss'
})
export class ProjectsSectionComponent {
    readonly projects = [
        {
            number: '01',
            category: 'Brand Identity',
            title: 'Luminary Studio',
            desc: 'A full rebrand for a luxury photography studio — logo, type system, and digital presence.',
            tags: ['Branding', 'Typography', 'Web'],
        },
        {
            number: '02',
            category: 'UI/UX Design',
            title: 'Nexus Dashboard',
            desc: 'Complex SaaS analytics platform redesigned for clarity, speed, and delight.',
            tags: ['UX Research', 'Design System', 'Angular'],
        },
        {
            number: '03',
            category: 'Web Development',
            title: 'Artéfact Gallery',
            desc: 'A minimalist e-commerce gallery site for contemporary art with immersive animations.',
            tags: ['Development', 'Motion', 'E-commerce'],
        },
        {
            number: '04',
            category: 'Digital Strategy',
            title: 'Vantage Fintech',
            desc: 'Go-to-market strategy and landing experience for a Series A fintech startup.',
            tags: ['Strategy', 'Landing', 'CRO'],
        },
    ];
}
