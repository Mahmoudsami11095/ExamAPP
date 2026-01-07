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
            {
                path: 'exams',
                loadComponent: () => import('./features/exams/exams.component').then(m => m.ExamsComponent),
                title: 'Exams'
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
                title: 'Settings'
            },
            {
                path: 'quiz/:id',
                loadComponent: () => import('./features/questions/questions.component').then(m => m.QuestionsComponent),
                title: 'Quiz'
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
