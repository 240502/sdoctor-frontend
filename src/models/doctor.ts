import { DoctorSchedule } from './doctorSchedule';

export interface Doctor {
    doctor_id: number;
    user_id: number;
    full_name: string;
    clinic_id: number;
    major_id: number;
    summary: String;
    image: string;
    email: string;
    phone: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    city: string;
    district: string;
    commune: string;
    gender: number;
    title: string;
    price: number;
    views: number;
    clinic_name: string;
    location: string;
    major_name: string;
    schedule: DoctorSchedule;
    introduction: string;
    birthday: Date;
    service_id: number;
    service_name: string;
}
