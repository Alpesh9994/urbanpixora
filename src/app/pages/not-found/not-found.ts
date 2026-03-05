import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/services/seo.service';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
<section class="nf-shell">
    <div class="nf-glow" aria-hidden="true"></div>
    <div class="nf-content">
        <p class="nf-code">404</p>
        <h1 class="nf-heading">Page Not Found</h1>
        <p class="nf-sub">Looks like this page wandered off the grid. Let's get you back on track.</p>
        <div class="nf-actions">
            <a class="btn-primary" routerLink="/"><span>Go Home →</span></a>
            <a class="nf-link" routerLink="/projects">View Projects</a>
        </div>
    </div>
</section>
    `,
    styleUrl: './not-found.scss'
})
export class NotFoundComponent {
    constructor(private seo: SeoService) {
        this.seo.set({
            title: '404 — Page Not Found',
            description: 'The page you are looking for does not exist. Head back to UrbanPixora to explore our work.',
            path: '/404',
        });
    }
}
