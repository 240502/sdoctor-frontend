import { AppLayout } from '../modules/app';
import { Home } from '../modules/home';

export const publicRoutes = [
    {
        path: '/',
        component: Home,
        layout: AppLayout,
    },
];
