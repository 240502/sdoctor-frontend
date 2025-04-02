import { DoctorSchedule } from './doctor_schedule';

export interface Pagination {
    pageIndex?: number;
    pageSize?: number;
}
export interface DoctorOptions extends Pagination {
    clinicId: number | null;
    majorIds: number[];
    doctorServiceIds: number[];
    startPrice: number | null;
    endPrice: number | null;
    gender: string | null;
    doctorTitles: string[];
    departmentId: number;
}
export interface CommonDoctorOptions extends Pagination {
    withoutId?: number | null;
}
export interface Doctor {
    doctorId: number;
    userId: number;
    fullName: string;
    clinicId: number;
    majorId: number;
    summary: String;
    image: string;
    email: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    city: string;
    district: string;
    commune: string;
    gender: number;
    title: string;
    price: number;
    views: number;
    clinicName: string;
    location: string;
    majorName: string;
    schedule: DoctorSchedule;
    introduction: string;
    birthday: Date;
    serviceId: number;
    serviceName: string;
    averageStar: number;
}
