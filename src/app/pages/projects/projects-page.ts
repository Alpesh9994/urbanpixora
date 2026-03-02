import { Component, signal } from '@angular/core';

import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ScrollRevealDirective, FooterComponent],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent {
  readonly categories = ['All', 'Branding', 'Web', 'UI/UX', 'Strategy'];
  activeFilter = signal('All');

  readonly allProjects = [
    { title: 'Luminary Studio', category: 'Branding', tags: ['Logo', 'Identity', 'Print'], year: '2024', desc: 'Full rebrand for a luxury photography studio — logo, type system, and digital guidelines.' },
    { title: 'Nexus Dashboard', category: 'UI/UX', tags: ['UX Research', 'Angular', 'Design System'], year: '2024', desc: 'Complex SaaS analytics platform redesigned for clarity, speed, and delight.' },
    { title: 'Artéfact Gallery', category: 'Web', tags: ['Angular', 'E-commerce', 'Motion'], year: '2023', desc: 'A minimalist e-commerce gallery for contemporary art with immersive animations.' },
    { title: 'Vantage Fintech', category: 'Strategy', tags: ['Strategy', 'Landing', 'CRO'], year: '2023', desc: 'Go-to-market strategy and launch experience for a Series A fintech startup.' },
    { title: 'Helio Brand System', category: 'Branding', tags: ['Brand', 'Typography', 'Colour'], year: '2023', desc: 'Comprehensive visual identity system for a solar technology company.' },
    { title: 'Orbit SaaS Platform', category: 'Web', tags: ['Node.js', 'Angular', 'API'], year: '2022', desc: 'Full-stack project management tool built from zero to production.' },
    { title: 'Canvasa Design Co', category: 'UI/UX', tags: ['Mobile', 'Prototype', 'User Testing'], year: '2022', desc: 'Mobile-first design app — wireframes through to pixel-perfect delivery.' },
    { title: 'Metric Growth Studio', category: 'Strategy', tags: ['SEO', 'Analytics', 'CRO'], year: '2021', desc: 'Digital strategy overhaul that tripled organic traffic in 6 months.' },
  ];

  get filteredProjects() {
    const f = this.activeFilter();
    return f === 'All' ? this.allProjects : this.allProjects.filter(p => p.category === f);
  }

  setFilter(cat: string) { this.activeFilter.set(cat); }
}
