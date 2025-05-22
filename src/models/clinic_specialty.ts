export interface ClinicSpecialtyCreateDto {
    clinicId: number | null;
    specialtyId: number;
}
export interface ClinicSpecialtyUpdateDto {
    clinicId: number | null;
    specialtyId: number;
    id: number;
}

export interface ClinicSpecialty {
    id: number;
    clinicId: number | null;
    specialtyId: number;
    imageUrl: string;
    name: string;
}
