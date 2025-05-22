export interface WorkingHours {
    id: number;
    clinicId: number | null;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}
export interface WorkingHoursCreateDto {
    clinicId: number | null;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}
