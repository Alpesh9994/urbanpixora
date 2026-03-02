import { Component } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero';
import { IntroSectionComponent } from './sections/intro-section/intro-section';
import { ServicesSectionComponent } from './sections/services-section/services-section';
import { ProjectsSectionComponent } from './sections/projects-section/projects-section';
import { StatsSectionComponent } from './sections/stats-section/stats-section';
import { TeamSectionComponent } from './sections/team-section/team-section';
import { TestimonialsSectionComponent } from './sections/testimonials-section/testimonials-section';
import { CtaSectionComponent } from './sections/cta-section/cta-section';
import { FooterComponent } from '../../shared/components/footer/footer';

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
export class HomePageComponent { }
