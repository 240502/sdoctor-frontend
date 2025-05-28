export interface PatientProfile {
    id: number;
    patientName: string;
    gender: number;
    patientPhone: string;
    patientEmail: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    createdAt: string;
    updatedAt: string;
    uuid: string;
}

export interface PatientProfileCreateDTO {
    patientName: string;
    gender: number;
    patientPhone: string;
    patientEmail: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    uuid: string;
}
