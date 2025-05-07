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
