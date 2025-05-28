export interface DoctorServiceCreateDTO {
    doctorId: number;
    serviceId: number;
    customPrice: number;
}

export interface DoctorServiceUpdateDTO {
    id: number;
    serviceId: number;
    customPrice: number;
}

export interface DoctorService {
    id: number | null;
    doctorId: number | null;
    serviceId: number | null;
    customPrice: number | null;
    basePrice: number | null;
    serviceName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    departmentId: number | null;
}
