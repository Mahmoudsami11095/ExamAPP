import { Routes } from '@angular/router';
import { Login } from './core/pages/login/login';
import { RegisterComponent } from './core/pages/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'auth/login',
        component: Login
    },
    {
        path: 'auth/register',
        component: RegisterComponent
    },
    { 
        path: '**', 
        redirectTo: '/auth/login' }

];
