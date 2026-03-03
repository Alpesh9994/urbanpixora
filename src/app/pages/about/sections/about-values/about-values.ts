import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
    selector: 'app-about-values',
    standalone: true,
    imports: [ScrollRevealDirective],
    templateUrl: './about-values.html',
    styleUrl: './about-values.scss'
})
export class AboutValuesComponent {
    readonly values = [
        { icon: '◈', title: 'Craft First', desc: 'We obsess over quality. Every pixel, every line of code, every word is considered.' },
        { icon: '◎', title: 'Honest Work', desc: 'No smoke and mirrors. We deliver real results with complete transparency.' },
        { icon: '⬡', title: 'Collaboration', desc: 'Your goals become our goals. We treat every client as a long-term partner.' },
        { icon: '✦', title: 'Continuous Growth', desc: 'Design and tech evolve fast. We stay ahead so your products stay relevant.' },
    ];

    readonly steps = [
        { num: '01', title: 'Discovery & Strategy', desc: 'We start by deeply understanding your business, audience, and goals through research and workshops.' },
        { num: '02', title: 'Design & Prototyping', desc: 'Wireframes, mood boards, and high-fidelity mockups are iterated until the vision is crystal clear.' },
        { num: '03', title: 'Build & Develop', desc: 'Clean, performant code and refined UI come together with great engineering practices.' },
        { num: '04', title: 'Launch & Optimise', desc: 'We deploy, test, and refine post-launch — ensuring peak performance and happy users.' },
    ];

    readonly techStack = [
        { icon: '🅰️', name: 'Angular' },
        { icon: '⚛️', name: 'React' },
        { icon: '🟩', name: 'Node.js' },
        { icon: 'ts', name: 'TypeScript' },
        { icon: '🎨', name: 'Figma' },
        { icon: '☁️', name: 'AWS' },
    ];
}
