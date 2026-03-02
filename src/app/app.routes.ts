import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home/home-page').then(m => m.HomePageComponent)
    },
    {
        path: 'about',
        loadComponent: () =>
            import('./pages/about/about-page').then(m => m.AboutPageComponent)
    },
    {
        path: 'contact',
        loadComponent: () =>
            import('./pages/contact/contact-page').then(m => m.ContactPageComponent)
    },
    {
        path: 'services',
        loadComponent: () =>
            import('./pages/services/services-page').then(m => m.ServicesPageComponent)
    },
    {
        path: 'projects',
        loadComponent: () =>
            import('./pages/projects/projects-page').then(m => m.ProjectsPageComponent)
    },
    { path: '**', redirectTo: '' }
];
