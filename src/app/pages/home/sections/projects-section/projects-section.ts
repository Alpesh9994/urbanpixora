import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { ProjectsDataService } from '../../../../shared/services/projects-data.service';

@Component({
    selector: 'app-projects-section',
    standalone: true,
    imports: [RouterLink, ScrollRevealDirective],
    templateUrl: './projects-section.html',
    styleUrl: './projects-section.scss'
})
export class ProjectsSectionComponent {
    private projectsData = inject(ProjectsDataService);

    // Show the first 4 projects from the shared data service
    readonly projects = this.projectsData.getAll().slice(0, 4).map((p, i) => ({
        number: String(i + 1).padStart(2, '0'),
        slug: p.slug,
        category: p.category,
        title: p.title,
        desc: p.desc,
        tags: p.tags.slice(0, 3),
    }));
}
