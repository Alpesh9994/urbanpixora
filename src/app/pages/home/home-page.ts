import { Component, OnInit, signal, inject } from '@angular/core';
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
import { CmsService, CmsPage, CmsSection } from '../../shared/services/cms.service';

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
    @if (pageData()) {
      <app-hero [data]="getSection('hero')" />
      <app-intro-section />
      <app-services-section [data]="getSection('services')" />
      <app-projects-section [data]="getSection('portfolio')" />
      <app-stats-section />
      <app-team-section />
      <app-testimonials-section [data]="getSection('testimonials')" />
      <app-cta-section [data]="getSection('cta')" />
      <app-footer />
    } @else {
      <div class="loading-state">Loading...</div>
    }
  `
})
export class HomePageComponent implements OnInit {
  private seo = inject(SeoService);
  private cms = inject(CmsService);

  pageData = signal<CmsPage | null>(null);

  ngOnInit() {
    this.cms.getPage('home').subscribe({
      next: (data) => {
        this.pageData.set(data);
        this.seo.set({
          title: data.meta_title || data.title,
          description: data.meta_description || '',
          path: '/',
        });
      },
      error: (err) => console.error('Failed to load home page data', err)
    });
  }

  getSection(type: string): CmsSection | undefined {
    const page = this.pageData();
    return page ? this.cms.getSection(page, type) : undefined;
  }
}
