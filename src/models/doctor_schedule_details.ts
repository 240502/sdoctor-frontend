export interface DoctorScheduleDetail {
    id: number | null;
    scheduleId: number | null;
    startTime: string | null;
    endTime: string | null;
    available: number | null;
    action: number | null;
    timeId: number;
}
