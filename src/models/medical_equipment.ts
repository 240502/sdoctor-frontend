export interface MedicalEquipment {
    id: number;
    clinicId: number;
    name: string;
    createdAt: Date;
}

export interface MedicalEquipmentCreateDto {
    clinicId: number | null;
    name: string;
}
export interface MedicalEquipmentUpdateDto {
    clinicId: number | null;
    name: string;
    id: number | null;
}
