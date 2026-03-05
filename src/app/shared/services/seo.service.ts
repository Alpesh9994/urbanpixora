import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SeoConfig {
    title: string;
    description: string;
    /** Absolute URL to the OG image (optional, defaults to the site hero) */
    image?: string;
    /** Canonical path, e.g. '/projects/luminary-studio' */
    path?: string;
    type?: 'website' | 'article';
}

const SITE_NAME = 'UrbanPixora';
const BASE_URL = 'https://urbanpixora.com'; // ← update to your real domain
const DEFAULT_IMAGE = `${BASE_URL}/who-we-are.webp`;

@Injectable({ providedIn: 'root' })
export class SeoService {
    private titleSvc = inject(Title);
    private metaSvc = inject(Meta);
    private router = inject(Router);

    set(config: SeoConfig) {
        const fullTitle = `${config.title} — ${SITE_NAME}`;
        const url = `${BASE_URL}${config.path ?? this.router.url}`;
        const image = config.image ?? DEFAULT_IMAGE;
        const type = config.type ?? 'website';

        // ── Primary ──────────────────────────────────────────────
        this.titleSvc.setTitle(fullTitle);

        this.metaSvc.updateTag({ name: 'description', content: config.description });

        // ── Open Graph ───────────────────────────────────────────
        this.metaSvc.updateTag({ property: 'og:title', content: fullTitle });
        this.metaSvc.updateTag({ property: 'og:description', content: config.description });
        this.metaSvc.updateTag({ property: 'og:url', content: url });
        this.metaSvc.updateTag({ property: 'og:image', content: image });
        this.metaSvc.updateTag({ property: 'og:type', content: type });
        this.metaSvc.updateTag({ property: 'og:site_name', content: SITE_NAME });

        // ── Twitter Card ─────────────────────────────────────────
        this.metaSvc.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaSvc.updateTag({ name: 'twitter:title', content: fullTitle });
        this.metaSvc.updateTag({ name: 'twitter:description', content: config.description });
        this.metaSvc.updateTag({ name: 'twitter:image', content: image });
    }
}
