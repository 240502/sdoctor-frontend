import { Schedule } from './schdule';

export interface Doctor {
    id: number;
    full_name: string;
    clinic_id: number;
    major_id: number;
    description: String;
    image: String;
    email: String;
    phone: String;
    password: String;
    created_at: Date;
    updated_at: Date;
    address: String;
    gender: number;
    title: String;
    fee: number;
    examination_object: String;
    views: number;
    clinic_name: String;
    location: string;
    major_name: string;
    schedule: Schedule;
    introduction: string;
}
