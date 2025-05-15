export interface Education {
    educationId: number;
    doctorId: number;
    degree: string;
    institution: string;
    startDate: Date;
    endDate: Date;
}

export interface EducationCreateDto {
    doctorId: number;
    degree: string;
    institution: string;
    startDate: Date;
    endDate: Date;
}

export interface EducationUpdateDto {
    id: number | null;
    degree: string;
    institution: string;
    fromYear: number;
    toYear: number;
}
