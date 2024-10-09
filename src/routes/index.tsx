import { AppLayout } from '../modules/app';
import { ViewClinic } from '../modules/clinic';
import { ViewDetailDoctor, ViewDoctor } from '../modules/doctor';
import { Home } from '../modules/home';
import { ViewSpecialization } from '../modules/specialization';
import {
    HOME_PATH,
    VIEW_CLINIC_PATH,
    VIEW_DETAIL_DOCTOR_PATH,
    VIEW_DOCTOR_PATH,
    VIEW_SPECIALIZATION_PATH,
} from './path';
export const publicRoutes = [
    {
        path: HOME_PATH,
        component: Home,
        layout: AppLayout,
    },
    {
        path: VIEW_DOCTOR_PATH,
        component: ViewDoctor,
        layout: AppLayout,
    },
    {
        path: VIEW_SPECIALIZATION_PATH,
        component: ViewSpecialization,
        layout: AppLayout,
    },
    {
        path: VIEW_DETAIL_DOCTOR_PATH,
        component: ViewDetailDoctor,
        layout: AppLayout,
    },
    {
        path: VIEW_CLINIC_PATH,
        component: ViewClinic,
        layout: AppLayout,
    },
];
