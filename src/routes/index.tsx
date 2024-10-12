import { AppLayout } from '../modules/account/app';
import { ViewClinic } from '../modules/account/clinic';
import { ViewClinicDetail } from '../modules/account/clinic/views/ViewClinicDetail';
import { ViewDetailDoctor, ViewDoctor } from '../modules/account/doctor';
import { Home } from '../modules/account/home';
import { Login } from '../modules/account/login/login';
import { ViewNews } from '../modules/account/news';
import { ViewService, ViewDetailService } from '../modules/account/service';
import { DashBoard } from '../modules/auth/dashboard';
import { AdminLayout } from '../modules/auth/layout';
import {
    HOME_PATH,
    VIEW_CLINIC_DETAIL_PATH,
    VIEW_CLINIC_PATH,
    VIEW_DETAIL_DOCTOR_PATH,
    VIEW_DOCTOR_PATH,
    VIEW_SERVICE_PATH,
    VIEW_SERVICE_DETAIL_PATH,
    VIEW_NEWS_PATH,
    ADMIN_PATH,
    LOGIN_PATH,
    DASHBOARD_PATH,
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
    {
        path: LOGIN_PATH,
        component: Login,
        layout: null,
    },
];

export const privateRoutes = [
    {
        path: DASHBOARD_PATH,
        component: DashBoard,
        layout: AdminLayout,
    },
];
