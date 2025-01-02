import { Functions } from './functions';

export interface User {
    userId: number;
    fullName: string;
    image: string;
    phone: string;
    gender: string;
    city: string;
    district: string;
    commune: string;
    email: string;
    password: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
    birthday: Date;
    token: string;
    functions: Functions[];
    doctorId: number;
    active: number;
}
