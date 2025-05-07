export interface DoctorExpertises {
    id: number;
    doctorId: number;
    specialtyId: number;
    expertieseId: number;
}

export interface DoctorExpertisesCreateDto {
    doctorId: number;
    specialtyId: number;
    expertieseId: number;
}
