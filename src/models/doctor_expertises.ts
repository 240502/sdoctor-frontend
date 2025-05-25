export interface DoctorExpertises {
    id: number;
    doctorId: number;
    specialtyId: number;
    expertieseId: number;
    expertise: string;
}

export interface DoctorExpertisesCreateDto {
    doctorId: number;
    specialtyId: number;
    expertieseId: number;
}
