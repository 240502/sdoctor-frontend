import { DoctorExpertises } from './doctor_expertises';
import { Education } from './education';
import { Schedules } from './schedule';
import { WorkExperience } from './work_experience';

interface Pagination {
    pageIndex?: number;
    pageSize?: number;
}
export interface DoctorOptions extends Pagination {
    clinicId: number | null;
    majorIds?: number[] | null;
    doctorServiceIds?: number[];
    startPrice?: number | null;
    endPrice?: number | null;
    gender?: string | null;
    doctorTitles?: string[];
    departmentIds?: number[] | null;
    searchContent?: string | null;
}
export interface CommonDoctorOptions extends Pagination {
    withoutId?: number | null;
}
export interface Doctor {
    doctorId: number;
    userId: number;
    fullName: string;
    clinicId: number;
    summary: string;
    image: string;
    email: string;
    phone: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    city: string;
    district: string;
    commune: string;
    gender: number;
    title: number;
    servicePrice: number;
    views: number;
    clinicName: string;
    location: string;
    departmentName: string;
    schedule: Schedules[];
    introduction: string;
    birthday: string;
    averageStar: number;
    titleName: string;
    department: number;
    doctorExpertises: DoctorExpertises[];
    workExperiences: WorkExperience[];
    eduction: Education[];
}

export interface DoctorCreateDto {
    email: string;
    gender: number;
    phone: string;
    image: string;
    fullName: string;
    birthday: string;
    city: string;
    district: string;
    commune: string;
    clinicId: number;
    summary: string;
    title: number;
    introduction: string;
    department: number;
    servicePrice: number;
}

export interface DoctorUpdateDto {
    doctorId: number;
    image: string;
    clinicId: number;
    department: number;
    fullName: string;
    gender: number;
    phone: string;
    email: string;
    city: string;
    district: string;
    commune: string;
    title: number;
    birthday: string;
    servicePrice: number;
    summary: string;
    introduction: string;
}
