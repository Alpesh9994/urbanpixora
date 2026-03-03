import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { TeamSectionComponent } from '../home/sections/team-section/team-section';
import { FooterComponent } from '../../shared/components/footer/footer';
import { AboutHeroComponent } from './sections/about-hero/about-hero';
import { AboutStoryComponent } from './sections/about-story/about-story';
import { AboutValuesComponent } from './sections/about-values/about-values';

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
export class AboutPageComponent {
  // Data moved to child components
}
