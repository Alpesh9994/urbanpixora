import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { ProjectsDataService, Project } from '../../../shared/services/projects-data.service';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [RouterLink, ScrollRevealDirective, FooterComponent],
    templateUrl: 'project-detail.html',
    styleUrl: 'project-detail.scss',
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private projectsData = inject(ProjectsDataService);
    private seo = inject(SeoService);

    project!: Project;
    nextProject!: Project;

    private paramSub!: Subscription;

    ngOnInit() {
        this.paramSub = this.route.paramMap.subscribe(params => {
            const slug = params.get('slug') ?? '';
            const found = this.projectsData.getBySlug(slug);
            if (!found) {
                this.router.navigateByUrl('/projects');
                return;
            }
            this.project = found;
            this.nextProject = this.projectsData.getNext(slug);

            // Per-project dynamic SEO
            this.seo.set({
                title: this.project.title,
                description: `${this.project.desc} — A ${this.project.category} project by UrbanPixora for ${this.project.client}.`,
                path: `/projects/${slug}`,
                type: 'article',
            });
        });
    }

    ngOnDestroy() {
        this.paramSub?.unsubscribe();
    }
}
