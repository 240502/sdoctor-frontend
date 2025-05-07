export interface WorkExperience {
    experienceId: number;
    doctorId: number;
    workplace: string;
    position: string;
    startDate: Date;
    endDate: Date;
}

export interface WorkExperienceCreateDto {
    doctorId: number;
    workplace: string;
    position: string;
    startDate: Date;
    endDate: Date;
}
