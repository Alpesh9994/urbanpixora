import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-team-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './team-section.html',
    styleUrl: './team-section.scss'
})
export class TeamSectionComponent {
    readonly partners = [
        {
            initials: 'JD',
            name: 'Jayram Desai',
            role: 'Co-Founder & Full-Stack Developer',
            bio: 'Jayram leads all engineering at UrbanPixora — from pixel-perfect Angular frontends to robust Node.js backends. With a passion for clean architecture and performance-first development, he turns complex ideas into fast, scalable digital products.',
            specialties: ['Frontend (Angular)', 'Backend (Node.js)', 'UI Engineering', 'Performance'],
            color: '#f5a623',
        },
        {
            initials: 'VD',
            name: 'Vishal Desai',
            role: 'Co-Founder & Brand/Graphics Designer',
            bio: 'Vishal is the creative heartbeat of UrbanPixora. He crafts distinctive brand identities, visual systems, and graphic narratives that make businesses instantly recognisable. Every mark, type choice, and palette is intentional.',
            specialties: ['Brand Identity', 'Logo Design', 'Visual Systems', 'Typography'],
            color: '#0a0a0a',
        },
    ];
}
