import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-services-section',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './services-section.html',
    styleUrl: './services-section.scss'
})
export class ServicesSectionComponent {
    readonly services = [
        {
            icon: '✦',
            title: 'Brand Identity',
            desc: 'We craft distinctive visual identities that communicate your brand\'s values and resonate with your audience.'
        },
        {
            icon: '◈',
            title: 'UI/UX Design',
            desc: 'Human-centred design systems and interfaces that are both beautiful and intuitive to use.'
        },
        {
            icon: '⬡',
            title: 'Web Development',
            desc: 'High-performance web applications built with modern frameworks, optimised for speed and scalability.'
        },
        {
            icon: '◎',
            title: 'Motion & Animation',
            desc: 'Dynamic micro-interactions and storytelling animations that bring your digital experience to life.'
        },
        {
            icon: '⊞',
            title: 'Digital Strategy',
            desc: 'Data-driven strategies and roadmaps to grow your digital presence and achieve business goals.'
        },
        {
            icon: '◇',
            title: 'Creative Direction',
            desc: 'End-to-end creative oversight ensuring every touchpoint is coherent, compelling, and on-brand.'
        },
    ];
}
