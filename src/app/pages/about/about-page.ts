import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { TeamSectionComponent } from '../home/sections/team-section/team-section';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, TeamSectionComponent, FooterComponent],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss'
})
export class AboutPageComponent {
  readonly stats = [
    { val: '120+', lbl: 'Projects Delivered', accent: false },
    { val: '8+', lbl: 'Years Experience', accent: true },
    { val: '40+', lbl: 'Happy Clients', accent: false },
    { val: '2', lbl: 'Founding Partners', accent: false },
  ];

  readonly values = [
    { icon: '◈', title: 'Craft First', desc: 'We obsess over quality. Every pixel, line of code, and word is considered.' },
    { icon: '◎', title: 'Honest Work', desc: 'No smoke and mirrors. Real results with complete transparency.' },
    { icon: '⬡', title: 'Collaboration', desc: 'Your goals become our goals. Every client is treated as a long-term partner.' },
    { icon: '✦', title: 'Continuous Growth', desc: 'Design and tech evolve fast. We stay ahead so your products stay relevant.' },
  ];

  readonly steps = [
    { num: '01', title: 'Discovery & Strategy', desc: 'Deeply understand your business, audience, and goals through research and workshops.' },
    { num: '02', title: 'Design & Prototyping', desc: 'Wireframes, mood boards, and high-fidelity mockups iterated until the vision is clear.' },
    { num: '03', title: 'Build & Develop', desc: 'Clean, performant code and refined UI built with great engineering practices.' },
    { num: '04', title: 'Launch & Optimise', desc: 'Deploy, test, and refine post-launch — ensuring peak performance and happy users.' },
  ];
}
