import { Schedule } from './schedule';

export interface Doctor {
    id: number;
    full_name: string;
    clinic_id: number;
    major_id: number;
    description: String;
    image: string;
    email: string;
    phone: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    address: string;
    gender: number;
    title: string;
    fee: number;
    examination_object: string;
    views: number;
    clinic_name: string;
    location: string;
    major_name: string;
    schedule: Schedule;
    introduction: string;
}
