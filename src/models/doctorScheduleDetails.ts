export interface DoctorScheduleDetail {
    id: number;
    schedule_id: number | null;
    time_id: number;
    available: number | null;
    action: number | null;
}
