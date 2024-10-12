import { Schedule } from './schdule';

export interface Doctor {
    id: Number;
    full_name: String;
    clinic_id: Number;
    major_id: Number;
    description: String;
    image: String;
    email: String;
    phone: String;
    password: String;
    created_at: Date;
    updated_at: Date;
    address: String;
    gender: String;
    title: String;
    fee: Number;
    examination_object: String;
    views: number;
    clinic_name: String;
    location: string;
    major_name: String;
    schedule: Schedule;
    introduction: string;
}
