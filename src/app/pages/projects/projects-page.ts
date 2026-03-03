import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../shared/components/footer/footer';
import { ProjectsDataService } from '../../shared/services/projects-data.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective, FooterComponent],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent {
  private projectsData = inject(ProjectsDataService);

  readonly categories = ['All', 'Branding', 'Web', 'UI/UX', 'Strategy'];
  activeFilter = signal('All');
  readonly allProjects = this.projectsData.getAll();

  get filteredProjects() {
    const f = this.activeFilter();
    return f === 'All' ? this.allProjects : this.allProjects.filter(p => p.category === f);
  }

  setFilter(cat: string) { this.activeFilter.set(cat); }
}
