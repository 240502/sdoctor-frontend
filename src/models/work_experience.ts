export interface WorkExperience {
    experienceId: number;
    doctorId: number;
    workplace: string;
    position: string;
    fromYear: Date;
    toYear: Date;
}

export interface WorkExperienceCreateDto {
    doctorId: number;
    workplace: string;
    position: string;
    fromYear: Date;
    toYear: Date;
}

export interface WorkExperienceUpdateDto {
    id: number | null;
    workplace: string;
    position: string;
    fromYear: number;
    toYear: number;
}
