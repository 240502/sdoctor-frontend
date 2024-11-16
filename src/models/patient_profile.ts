export interface PatientProfile {
    id: number;
    patient_name: string;
    gender: string;
    patient_phone: string;
    patient_email: string;
    birthday: Date | string;
    province: string;
    district: string;
    commune: string;
    created_at: string;
    updated_at: string;
    uuid: string;
}
