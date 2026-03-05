import { Component, OnInit, inject } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero';
import { IntroSectionComponent } from './sections/intro-section/intro-section';
import { ServicesSectionComponent } from './sections/services-section/services-section';
import { ProjectsSectionComponent } from './sections/projects-section/projects-section';
import { StatsSectionComponent } from './sections/stats-section/stats-section';
import { TeamSectionComponent } from './sections/team-section/team-section';
import { TestimonialsSectionComponent } from './sections/testimonials-section/testimonials-section';
import { CtaSectionComponent } from './sections/cta-section/cta-section';
import { FooterComponent } from '../../shared/components/footer/footer';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    IntroSectionComponent,
    ServicesSectionComponent,
    ProjectsSectionComponent,
    StatsSectionComponent,
    TeamSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent,
    FooterComponent,
  ],
  template: `
    <app-hero />
    <app-intro-section />
    <app-services-section />
    <app-projects-section />
    <app-stats-section />
    <app-team-section />
    <app-testimonials-section />
    <app-cta-section />
    <app-footer />
  `
})
export class HomePageComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.set({
      title: 'UrbanPixora — Digital Design Studio',
      description: 'UrbanPixora is a digital design studio crafting bold brand identities, UI/UX designs, and web experiences that stand out and deliver results.',
      path: '/',
    });
  }
}
