export interface WorkingHours {
    id: number;
    clinicId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}
export interface WorkingHoursCreateDto {
    clinicId: number | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}
