import { DoctorSchedule } from './doctorSchedule';

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
