import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout';
import { adminAuthGuard } from './guards/auth.guard';

export const adminRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/admin-login').then(m => m.AdminLoginComponent)
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [adminAuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
            },
            {
                // /admin/pages → redirect to dashboard (which already lists pages)
                path: 'pages',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: 'pages/:slug',
                loadComponent: () => import('./pages/page-editor/admin-page-editor').then(m => m.AdminPageEditorComponent)
            },
            {
                path: 'media',
                loadComponent: () => import('./pages/media/admin-media').then(m => m.AdminMediaComponent)
            }
        ]
    }
];
