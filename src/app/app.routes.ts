import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'diplomas',
                loadComponent: () => import('./features/diplomas/diplomas.component').then(m => m.DiplomasComponent),
                title: 'Diplomas'
            },
            { path: '', redirectTo: 'diplomas', pathMatch: 'full' }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: '**',
        redirectTo: 'diplomas'
    }
];
