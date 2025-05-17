export interface MedicalEquipment {
    id: number;
    clinicId: number;
    name: string;
    createdAt: Date;
}

export interface MedicalEquipmentCreateDto {
    clinicId: number;
    name: string;
}
