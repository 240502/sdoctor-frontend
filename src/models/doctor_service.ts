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
    id: number;
    doctorId: number;
    serviceId: number;
    customPrice: number;
    basePrice: number;
    serviceName: string;
    createdAt: Date;
    updatedAt: Date;
    departmentId: number;
}
