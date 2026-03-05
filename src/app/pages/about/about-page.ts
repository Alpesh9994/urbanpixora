import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { TeamSectionComponent } from '../home/sections/team-section/team-section';
import { FooterComponent } from '../../shared/components/footer/footer';
import { AboutHeroComponent } from './sections/about-hero/about-hero';
import { AboutStoryComponent } from './sections/about-story/about-story';
import { AboutValuesComponent } from './sections/about-values/about-values';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    RouterLink,
    ScrollRevealDirective,
    TeamSectionComponent,
    FooterComponent,
    AboutHeroComponent,
    AboutStoryComponent,
    AboutValuesComponent
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss'
})
export class AboutPageComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.set({
      title: 'About Us',
      description: 'Learn about UrbanPixora — our story, values, and the passionate team of designers and developers behind every pixel.',
      path: '/about',
    });
  }
}
