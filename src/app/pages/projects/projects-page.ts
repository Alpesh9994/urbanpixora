import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';
import { ProjectsDataService } from '../../shared/services/projects-data.service';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, FooterComponent],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent implements OnInit {
  private projectsData = inject(ProjectsDataService);
  private seo = inject(SeoService);

  readonly categories = ['All', 'Branding', 'Web', 'UI/UX', 'Strategy'];
  activeFilter = signal('All');
  readonly allProjects = this.projectsData.getAll();

  get filteredProjects() {
    const f = this.activeFilter();
    return f === 'All' ? this.allProjects : this.allProjects.filter(p => p.category === f);
  }

  isAnimating = signal(false);

  setFilter(cat: string) {
    if (this.activeFilter() === cat) return;
    // Brief fade-out, swap, fade-in
    this.isAnimating.set(true);
    setTimeout(() => {
      this.activeFilter.set(cat);
      this.isAnimating.set(false);
    }, 200);
  }

  ngOnInit() {
    this.seo.set({
      title: 'Our Projects',
      description: 'Explore the full portfolio of UrbanPixora — brand identities, UI/UX designs, web apps, and creative campaigns for clients worldwide.',
      path: '/projects',
    });
  }
}
