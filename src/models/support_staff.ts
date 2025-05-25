export interface SupportStaffCreateDTO {
    email: string;
    gender: number;
    phone?: string | null;
    image?: string | null;
    fullName: string;
    birthday: string;
    city: string;
    district: string;
    commune: string;
    supporterId: number;
}

export interface SupportStaffUpdateDTO {
    email: string;
    gender: number;
    phone?: string | null;
    image?: string | null;
    fullName: string;
    birthday: string;
    city: string;
    district: string;
    commune: string;
    supporterId: number;
    employeeId: number | null;
}

export interface SupportStaff {
    userId: number;
    email: string;
    gender: number;
    phone: string;
    image: string;
    fullName: string;
    birthday: string;
    city: string;
    district: string;
    commune: string;
    supporterId: number;
    createdAt: Date;
    updatedAt: Date;
    employeeId: string;
    clinicId: number;
}
