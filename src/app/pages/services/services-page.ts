import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, FooterComponent],
  templateUrl: './services-page.html',
  styleUrl: './services-page.scss'
})
export class ServicesPageComponent implements OnInit {
  private seo = inject(SeoService);

  readonly services = [
    {
      icon: '✦', num: '01', title: 'Brand Identity',
      tagline: 'Make an unforgettable first impression.',
      desc: 'We craft comprehensive visual identities — logos, typography systems, colour palettes, brand guidelines — that communicates your values and builds recognition across every touchpoint.',
      deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Colour Palette', 'Stationery & Print'],
    },
    {
      icon: '◈', num: '02', title: 'UI/UX Design',
      tagline: 'Design that converts and delights.',
      desc: 'Human-centred design built on real user research. We map user journeys, prototype solutions, and deliver polished UI that is intuitive, accessible, and beautiful.',
      deliverables: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
    },
    {
      icon: '⬡', num: '03', title: 'Web Development',
      tagline: 'Fast, scalable digital products.',
      desc: 'From Angular-powered SPAs to full-stack Node.js applications, we build performant, secure, and maintainable web products using modern architecture and best practices.',
      deliverables: ['Frontend (Angular)', 'Backend (Node.js)', 'REST APIs', 'Database Design', 'Performance Optimisation'],
    },
    {
      icon: '◎', num: '04', title: 'Motion & Animation',
      tagline: 'Bring your brand to life.',
      desc: 'Micro-interactions, scroll animations, and branded motion graphics that make your digital experience feel alive and premium.',
      deliverables: ['Micro-interactions', 'Scroll Animations', 'Lottie Animations', 'Video Graphics', 'Loading Experiences'],
    },
    {
      icon: '⊞', num: '05', title: 'Digital Strategy',
      tagline: 'Data-driven growth roadmaps.',
      desc: 'We analyse your market, define KPIs, and build actionable digital strategies that align design and technology decisions with measurable business outcomes.',
      deliverables: ['Competitive Analysis', 'CRO Strategy', 'Growth Roadmap', 'Analytics Setup', 'Content Strategy'],
    },
    {
      icon: '◇', num: '06', title: 'Creative Direction',
      tagline: 'One vision. Perfect execution.',
      desc: 'End-to-end creative oversight for campaigns, product launches, and brand refreshes — ensuring every deliverable is coherent, compelling, and on-brand.',
      deliverables: ['Art Direction', 'Campaign Concepting', 'Brand Refresh', 'Vendor Coordination', 'Creative Review'],
    },
  ];

  ngOnInit() {
    this.seo.set({
      title: 'Our Services',
      description: 'From brand identity and UI/UX to web development, motion design, and digital strategy — explore the full range of services UrbanPixora offers.',
      path: '/services',
    });
  }
}
