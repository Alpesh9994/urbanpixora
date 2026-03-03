import { Injectable } from '@angular/core';

export interface ProjectResult {
    metric: string;
    label: string;
}

export interface Project {
    slug: string;
    title: string;
    category: string;
    year: string;
    tags: string[];
    desc: string;
    color: string;      // accent colour for hero tint
    client: string;
    duration: string;
    deliverables: string;
    challenge: string;
    solution: string;
    results: ProjectResult[];
}

@Injectable({ providedIn: 'root' })
export class ProjectsDataService {

    readonly projects: Project[] = [
        {
            slug: 'luminary-studio',
            title: 'Luminary Studio',
            category: 'Branding',
            year: '2024',
            tags: ['Logo', 'Identity', 'Print', 'Brand Guidelines'],
            desc: 'Full rebrand for a luxury photography studio — logo, type system, and digital guidelines.',
            color: '#c9a96e',
            client: 'Luminary Studio',
            duration: '8 weeks',
            deliverables: 'Logo, Brand Guidelines, Business Cards, Social Kit',
            challenge: 'Luminary Studio had grown from a one-person operation into a full creative team, but their visual identity still reflected their early days — inconsistent, dated, and failing to attract high-end clients. They needed a complete rebrand that would signal maturity, craft, and luxury without losing their personal warmth.',
            solution: 'We designed a refined wordmark built around bespoke letterforms, paired with a warm-neutral colour system and a sophisticated typographic hierarchy. A full brand guidelines document codified every touchpoint from print collateral to social media templates, giving the team a consistent, scalable identity to grow into.',
            results: [
                { metric: '3×', label: 'Enquiry increase in 60 days' },
                { metric: '40%', label: 'Rise in average project value' },
                { metric: '100%', label: 'Team adoption on day one' },
            ],
        },
        {
            slug: 'nexus-dashboard',
            title: 'Nexus Dashboard',
            category: 'UI/UX',
            year: '2024',
            tags: ['UX Research', 'Angular', 'Design System', 'Prototyping'],
            desc: 'Complex SaaS analytics platform redesigned for clarity, speed, and delight.',
            color: '#4f7cff',
            client: 'Nexus Analytics',
            duration: '16 weeks',
            deliverables: 'UX Research, Wireframes, Design System, Angular Implementation',
            challenge: 'Nexus had a powerful data product buried under a confusing interface. Users were abandoning key features because they couldn\'t find or understand them. Churn was rising and the team knew UX was the bottleneck, not the underlying technology.',
            solution: 'We ran a full discovery sprint — interviews, usability testing, and analytics review — before touching any pixels. The redesign flattened the navigation, introduced a modular widget system, and built a living design system in Figma backed by an Angular component library. Every decision was tied back to validated user needs.',
            results: [
                { metric: '62%', label: 'Reduction in support tickets' },
                { metric: '4.2×', label: 'Feature adoption rate' },
                { metric: '28%', label: 'Decrease in onboarding time' },
            ],
        },
        {
            slug: 'artefact-gallery',
            title: 'Artéfact Gallery',
            category: 'Web',
            year: '2023',
            tags: ['Angular', 'E-commerce', 'Motion', 'WebGL'],
            desc: 'A minimalist e-commerce gallery for contemporary art with immersive animations.',
            color: '#2d2d2d',
            client: 'Artéfact Gallery, Paris',
            duration: '12 weeks',
            deliverables: 'Art Direction, Angular Web App, Motion Design, CMS Integration',
            challenge: 'A Parisian gallery wanted to sell contemporary art online without the site feeling like a typical e-commerce store. They needed an experience as considered and immersive as walking through the gallery itself — but built to convert.',
            solution: 'We led with art direction, treating every page as a composition. Smooth page transitions, WebGL texture distortion on hover, and a custom cursor gave the site a gallery-in-motion feeling. The checkout flow was stripped back to absolute essentials so nothing interrupted the purchase moment.',
            results: [
                { metric: '€220k', label: 'Revenue in first quarter online' },
                { metric: '3.1min', label: 'Average session duration' },
                { metric: '18%', label: 'Conversion rate (industry avg: 2%)' },
            ],
        },
        {
            slug: 'vantage-fintech',
            title: 'Vantage Fintech',
            category: 'Strategy',
            year: '2023',
            tags: ['Strategy', 'Landing Page', 'CRO', 'Analytics'],
            desc: 'Go-to-market strategy and launch experience for a Series A fintech startup.',
            color: '#00c896',
            client: 'Vantage (Series A)',
            duration: '6 weeks',
            deliverables: 'GTM Strategy, Landing Page, A/B Tests, Analytics Setup',
            challenge: 'Vantage had just closed their Series A and needed to launch publicly in six weeks. Their positioning was unclear, their messaging inconsistent, and they had no digital presence. The pressure was high — investors were watching the launch metrics closely.',
            solution: 'We ran a rapid positioning workshop to lock in their value proposition, then built a high-converting landing page with a clear narrative arc. Three A/B tests ran in parallel from day one. Google Analytics 4 and Hotjar were configured to give the team real-time insight into user behaviour.',
            results: [
                { metric: '12k', label: 'Waitlist signups in 30 days' },
                { metric: '34%', label: 'Email CTR (industry avg: 3%)' },
                { metric: '2.8×', label: 'Investor deck open rate vs benchmark' },
            ],
        },
        {
            slug: 'helio-brand-system',
            title: 'Helio Brand System',
            category: 'Branding',
            year: '2023',
            tags: ['Brand', 'Typography', 'Colour System', 'Icon Set'],
            desc: 'Comprehensive visual identity system for a solar technology company.',
            color: '#f5a623',
            client: 'Helio Solar',
            duration: '10 weeks',
            deliverables: 'Brand Strategy, Visual Identity, Icon Library, Motion Principles',
            challenge: 'Solar technology companies tend to look the same — green gradients, sun icons, stock photos of panels. Helio wanted to stand out in an increasingly crowded market and signal engineering credibility to B2B buyers, not just environmental sentiment to consumers.',
            solution: 'We built a brand system anchored in precision and optimism. The wordmark uses a custom geometric sans, the colour palette pairs deep navy with solar amber, and a bespoke icon library communicates technical concepts without jargon. Motion principles guide how the identity comes alive across product and marketing.',
            results: [
                { metric: '100+', label: 'Brand assets delivered' },
                { metric: '6', label: 'Countries the rebrand launched in' },
                { metric: '91%', label: 'Stakeholder approval in first review' },
            ],
        },
        {
            slug: 'orbit-saas-platform',
            title: 'Orbit SaaS Platform',
            category: 'Web',
            year: '2022',
            tags: ['Node.js', 'Angular', 'REST API', 'PostgreSQL'],
            desc: 'Full-stack project management tool built from zero to production.',
            color: '#7c3aed',
            client: 'Orbit (Internal)',
            duration: '24 weeks',
            deliverables: 'Architecture, Angular Frontend, Node.js API, DevOps Setup',
            challenge: 'The client needed a bespoke project management tool that fit their unusual agency workflow — specifically around client-facing milestone tracking and multi-currency invoicing. Off-the-shelf tools like Jira or Asana couldn\'t be configured to match their process without heavy workarounds.',
            solution: 'We designed and built Orbit from scratch — a Node.js REST API backed by PostgreSQL, an Angular 17 frontend with real-time updates via WebSockets, and a CI/CD pipeline on Railway. The milestone board, client portal, and invoice generator were all built to the team\'s exact specifications.',
            results: [
                { metric: '8hrs', label: 'Saved per week per project manager' },
                { metric: '0', label: 'Third-party SaaS subscriptions replaced' },
                { metric: '99.9%', label: 'Uptime in first year' },
            ],
        },
        {
            slug: 'canvasa-design-co',
            title: 'Canvasa Design Co',
            category: 'UI/UX',
            year: '2022',
            tags: ['Mobile', 'Prototype', 'User Testing', 'Figma'],
            desc: 'Mobile-first design app — wireframes through to pixel-perfect delivery.',
            color: '#e84d8a',
            client: 'Canvasa (Startup)',
            duration: '14 weeks',
            deliverables: 'User Research, Wireframes, High-Fidelity Prototypes, Developer Handoff',
            challenge: 'Canvasa had an idea for a mobile design tool targeting non-designers — people who need to produce professional visual content quickly without learning Figma or Photoshop. Their early prototypes were feature-rich but deeply confusing to test participants.',
            solution: 'We ran six rounds of usability testing across three prototype versions. Each round sharpened the core interaction model until non-designers could complete key tasks in under two minutes. The final design used progressive disclosure to hide complexity until users were ready for it, and a gesture-first interaction model built for mobile.',
            results: [
                { metric: '92%', label: 'Task completion rate in testing' },
                { metric: '1.8min', label: 'Time to first design (target: <2min)' },
                { metric: '4.8★', label: 'Beta user satisfaction score' },
            ],
        },
        {
            slug: 'metric-growth-studio',
            title: 'Metric Growth Studio',
            category: 'Strategy',
            year: '2021',
            tags: ['SEO', 'Analytics', 'CRO', 'Content Strategy'],
            desc: 'Digital strategy overhaul that tripled organic traffic in 6 months.',
            color: '#06b6d4',
            client: 'Metric Growth Studio',
            duration: '20 weeks (ongoing)',
            deliverables: 'SEO Audit, Content Strategy, CRO Programme, Monthly Reporting',
            challenge: 'A B2B SaaS client had invested heavily in content marketing with almost no measurable return. Their blog had 140 posts, none ranking on the first page of Google, and their conversion rate from organic traffic was below 0.5%. They were producing content for its own sake without a coherent strategy.',
            solution: 'We ran a full technical SEO audit, pruned 60% of thin content, and rebuilt a keyword-to-funnel content map. A new content calendar focused on bottom-of-funnel, high-intent pages backed by proper internal linking architecture. Simultaneously, we restructured landing pages using CRO best practices and installed heatmap tracking.',
            results: [
                { metric: '3.1×', label: 'Organic traffic in 6 months' },
                { metric: '#1', label: 'Google ranking for 14 target keywords' },
                { metric: '2.4%', label: 'Conversion rate (up from 0.4%)' },
            ],
        },
    ];

    getAll(): Project[] {
        return this.projects;
    }

    getBySlug(slug: string): Project | undefined {
        return this.projects.find(p => p.slug === slug);
    }

    getNext(slug: string): Project {
        const idx = this.projects.findIndex(p => p.slug === slug);
        return this.projects[(idx + 1) % this.projects.length];
    }
}
