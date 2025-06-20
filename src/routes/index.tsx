import BookingSuccess from '../components/BookingSuccess';
import AdminLayout from '../layouts/admin_layout';
import AppLayout from '../layouts/app_layout';
import BookingAppointment from '../modules/account/appointment_page';
import ViewClinicDetail from '../modules/account/clinic_detail_page';
import ViewClinic from '../modules/account/clinic_page';
import ViewDetailDoctor from '../modules/account/doctor_detail_page';
import ViewDoctor from '../modules/account/doctors_page';
import { Home } from '../modules/account/home_page';
import { LoginLayout } from '../modules/account/login_page';
import { ViewDepartment } from '../modules/account/department_page';
import ViewMedicalPackageDetail from '../modules/account/medical_package_detail_page';
import {
    PostDetail,
    ViewPost,
    ViewPostByCategory,
} from '../modules/account/news_page';
import {
    ViewAppointment,
    ViewProfile,
    ViewWatchedClinic,
    ViewWatchedDoctor,
} from '../modules/account/patient_profile_page';
import ViewService from '../modules/account/medical_package_page';
import { AppointmentManagement } from '../modules/admin/appointment_page';
import { ClinicManagement } from '../modules/admin/clinic_page';
import { DashBoard } from '../modules/admin/dashboard_page';
import { DoctorManagement } from '../modules/admin/doctor_page';
import { InvoiceManagement } from '../modules/admin/invoice_page';
import { NewsManagement } from '../modules/admin/news_page';
import { Profile } from '../modules/admin/profile_page';
import { ScheduleManagement } from '../modules/admin/schedule_page';
import { ServiceManagement } from '../modules/admin/service_management_page';
import { UserManagement } from '../modules/admin/user_page';

import {
    VIEW_POST_BY_CATEGORY_PATH,
    DOCTOR_PROFILE_PATH,
    VIEW_MAJOR_PATH,
    CLINIC_MANAGEMENT_PATH,
    HOME_PATH,
    VIEW_CLINIC_PATH,
    VIEW_DOCTOR_PATH,
    VIEW_DETAIL_DOCTOR_PATH,
    VIEW_CLINIC_DETAIL_PATH,
    VIEW_SERVICE_PATH,
    VIEW_SERVICE_DETAIL_PATH,
    VIEW_POST_PATH,
    VIEW_POST_DETAIL_PATH,
    LOGIN_PATH,
    DASHBOARD_PATH,
    APPOINTMENT_PATH,
    NEWS_PATH,
    DOCTOR_MANAGEMENT_PATH,
    SCHEDULE_MANAGEMENT_PATH,
    VIEW_PATIENT_PROFILE,
    VIEW_WATCHED_DOCTOR,
    VIEW_WATCHED_CLINIC,
    VIEW_PATIENT_APPOINTMENT,
    USER_MANAGEMENT_PATH,
    BOOKING_APPOINTMENT_PATH,
    BOOKING_SUCCESS_PATH,
    INVOICE_MANAGEMENT_PATH,
    PROFILE_PATH,
    SERVICE_MANAGEMENT_PATH,
    APPOINTMENT_DETAIL_PATH,
    SUPPORT_STAFF_PATH,
    REQUEST_MANAGEMENT_PATH,
    PATIENT_MANAGEMENT,
} from './path';
import AppointmentDetailPage from '../modules/admin/appointment_detail_page';
import { StaffManagement } from '../modules/admin/staff_management_page';
import { RequestsManagement } from '../modules/admin/requests_management_page';
import { ProfileDoctorPage } from '../modules/admin/profile_doctor_page';
import { PatientPage } from '../modules/admin/patient_page';
export const publicRoutes = [
    {
        path: BOOKING_SUCCESS_PATH,
        component: BookingSuccess,
        layout: null,
    },
    {
        path: VIEW_MAJOR_PATH,
        component: ViewDepartment,
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
        component: ViewMedicalPackageDetail,
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
        path: VIEW_PATIENT_APPOINTMENT,
        component: ViewAppointment,
        layout: AppLayout,
    },
    {
        path: VIEW_POST_BY_CATEGORY_PATH,
        component: ViewPostByCategory,
        layout: AppLayout,
    },
    {
        path: BOOKING_APPOINTMENT_PATH,
        component: BookingAppointment,
        layout: AppLayout,
    },
];

export const privateRoutes = [
    {
        path: PATIENT_MANAGEMENT,
        component: PatientPage,
        layout: AdminLayout,
    },
    {
        path: DOCTOR_PROFILE_PATH,
        component: ProfileDoctorPage,
        layout: AdminLayout,
    },
    {
        path: REQUEST_MANAGEMENT_PATH,
        component: RequestsManagement,
        layout: AdminLayout,
    },
    {
        path: APPOINTMENT_DETAIL_PATH,
        component: AppointmentDetailPage,
        layout: AdminLayout,
    },
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
    {
        path: INVOICE_MANAGEMENT_PATH,
        component: InvoiceManagement,
        layout: AdminLayout,
    },
    {
        path: PROFILE_PATH,
        component: Profile,
        layout: AdminLayout,
    },
    {
        path: SERVICE_MANAGEMENT_PATH,
        component: ServiceManagement,
        layout: AdminLayout,
    },
    {
        path: SUPPORT_STAFF_PATH,
        component: StaffManagement,
        layout: AdminLayout,
    },
];
