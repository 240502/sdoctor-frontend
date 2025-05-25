export interface Education {
    educationId: number;
    doctorId: number;
    degree: string;
    institution: string;
    fromYear: number;
    toYear: number;
}

export interface EducationCreateDto {
    doctorId: number;
    degree: string;
    institution: string;
    startDate: number;
    endDate: number;
}

export interface EducationUpdateDto {
    id: number | null;
    degree: string;
    institution: string;
    fromYear: number;
    toYear: number;
}
