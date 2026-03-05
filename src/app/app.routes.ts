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
    {
        path: 'projects/:slug',
        loadComponent: () =>
            import('./pages/projects/project-detail/project-detail').then(m => m.ProjectDetailComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
    },
    { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent) }
];
