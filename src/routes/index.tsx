import { AppLayout } from '../modules/account/app';
import { ViewClinic } from '../modules/account/clinic';
import { ViewClinicDetail } from '../modules/account/clinic/views/ViewClinicDetail';
import { ViewDetailDoctor, ViewDoctor } from '../modules/account/doctor';
import { Home } from '../modules/account/home';
import { LoginLayout } from '../modules/account/login/LoginLayout';
import {
    PostDetail,
    ViewPost,
    ViewPostByCategory,
} from '../modules/account/news';
import { ViewService, ViewDetailService } from '../modules/account/service';
import { AppointmentManagement } from '../modules/auth/appointment';
import { DashBoard } from '../modules/auth/dashboard';
import { AdminLayout } from '../modules/auth/layout';
import { NewsManagement } from '../modules/auth/news';
import { DoctorManagement } from '../modules/auth/doctor';

import {
    VIEW_POST_BY_CATEGORY_PATH,
    VIEW_MAJOR_PATH,
    CLINIC_MANAGEMENT_PATH,
    HOME_PATH,
    VIEW_CLINIC_PATH,
    VIEW_DOCTOR_PATH,
    VIEW_SPECIALIZATION_PATH,
    VIEW_DETAIL_DOCTOR_PATH,
    VIEW_CLINIC_DETAIL_PATH,
    VIEW_SERVICE_PATH,
    VIEW_SERVICE_DETAIL_PATH,
    VIEW_POST_PATH,
    VIEW_POST_DETAIL_PATH,
    LOGIN_PATH,
    ADMIN_PATH,
    DASHBOARD_PATH,
    APPOINTMENT_PATH,
    NEWS_PATH,
    DOCTOR_MANAGEMENT_PATH,
    SCHEDULE_MANAGEMENT_PATH,
    VIEW_PATIENT_PROFILE,
    VIEW_WATCHED_DOCTOR,
    VIEW_WATCHED_CLINIC,
    VIEW_WATCHED_SERVICE,
    VIEW_PATIENT_APPOINTMENT,
    USER_MANAGEMENT_PATH,
} from './path';
import { ScheduleManagement } from '../modules/auth/schedule';
import {
    ViewAppointment,
    ViewProfile,
    ViewWatchedClinic,
    ViewWatchedDoctor,
    ViewWatchedService,
} from '../modules/account/patient_profile';
import { ClinicManagement } from '../modules/auth/clinic';
import { ViewMajor } from '../modules/account/major';
import { UserManagement } from '../modules/auth/user';

export const publicRoutes = [
    {
        path: VIEW_MAJOR_PATH,
        component: ViewMajor,
        layout: AppLayout,
    },
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
        path: VIEW_POST_PATH,
        component: ViewPost,
        layout: AppLayout,
    },
    {
        path: VIEW_POST_DETAIL_PATH,
        component: PostDetail,
        layout: AppLayout,
    },
    {
        path: LOGIN_PATH,
        component: LoginLayout,
        layout: null,
    },
    {
        path: VIEW_WATCHED_DOCTOR,
        component: ViewWatchedDoctor,
        layout: AppLayout,
    },
    {
        path: VIEW_PATIENT_PROFILE,
        component: ViewProfile,
        layout: AppLayout,
    },
    {
        path: VIEW_WATCHED_CLINIC,
        component: ViewWatchedClinic,
        layout: AppLayout,
    },
    {
        path: VIEW_WATCHED_SERVICE,
        component: ViewWatchedService,
        layout: AppLayout,
    },
    {
        path: VIEW_PATIENT_APPOINTMENT,
        component: ViewAppointment,
        layout: AppLayout,
    },
    {
        path: VIEW_POST_BY_CATEGORY_PATH,
        component: ViewPostByCategory,
        layout: AppLayout,
    },
];

export const privateRoutes = [
    {
        path: DASHBOARD_PATH,
        component: DashBoard,
        layout: AdminLayout,
    },
    {
        path: APPOINTMENT_PATH,
        component: AppointmentManagement,
        layout: AdminLayout,
    },
    {
        path: NEWS_PATH,
        component: NewsManagement,
        layout: AdminLayout,
    },
    {
        path: DOCTOR_MANAGEMENT_PATH,
        component: DoctorManagement,
        layout: AdminLayout,
    },
    {
        path: SCHEDULE_MANAGEMENT_PATH,
        component: ScheduleManagement,
        layout: AdminLayout,
    },
    {
        path: CLINIC_MANAGEMENT_PATH,
        component: ClinicManagement,
        layout: AdminLayout,
    },
    {
        path: USER_MANAGEMENT_PATH,
        component: UserManagement,
        layout: AdminLayout,
    },
];
