export interface DoctorScheduleDetail {
    id: number | null;
    schedule_id: number | null;
    start_time: string | null;
    end_time: string | null;
    available: number | null;
    action: number | null;
    time_id: number;
}
