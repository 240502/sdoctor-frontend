import { AppLayout } from '../modules/app';
import { ViewClinic } from '../modules/clinic';
import { ViewClinicDetail } from '../modules/clinic/views/ViewClinicDetail';
import { ViewDetailDoctor, ViewDoctor } from '../modules/doctor';
import { Home } from '../modules/home';
import { ViewNews } from '../modules/news';
import { ViewService, ViewDetailService } from '../modules/service';
import {
    HOME_PATH,
    VIEW_CLINIC_DETAIL_PATH,
    VIEW_CLINIC_PATH,
    VIEW_DETAIL_DOCTOR_PATH,
    VIEW_DOCTOR_PATH,
    VIEW_SERVICE_PATH,
    VIEW_SERVICE_DETAIL_PATH,
    VIEW_NEWS_PATH,
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
        path: VIEW_DETAIL_DOCTOR_PATH,
        component: ViewDetailDoctor,
        layout: AppLayout,
    },
    {
        path: VIEW_CLINIC_PATH,
        component: ViewClinic,
        layout: AppLayout,
    },
    {
        path: VIEW_CLINIC_DETAIL_PATH,
        component: ViewClinicDetail,
        layout: AppLayout,
    },
    {
        path: VIEW_SERVICE_PATH,
        component: ViewService,
        layout: AppLayout,
    },
    {
        path: VIEW_SERVICE_DETAIL_PATH,
        component: ViewDetailService,
        layout: AppLayout,
    },
    {
        path: VIEW_NEWS_PATH,
        component: ViewNews,
        layout: AppLayout,
    },
];
