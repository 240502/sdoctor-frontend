import { AppLayout } from '../modules/app';
import { ViewDoctor } from '../modules/doctor';
import { Home } from '../modules/home';
import { HOME_PATH, DOCTOR_PATH } from './path';
export const publicRoutes = [
    {
        path: HOME_PATH,
        component: Home,
        layout: AppLayout,
    },
    {
        path: DOCTOR_PATH,
        component: ViewDoctor,
        layout: AppLayout,
    },
];
