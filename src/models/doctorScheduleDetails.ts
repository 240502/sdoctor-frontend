export interface DoctorScheduleDetail {
    id: number | null;
    schedule_id: number | null;
    start_time: string;
    end_time: string;
    available: number | null;
    action: number | null;
    appointment_duration: string;
}
