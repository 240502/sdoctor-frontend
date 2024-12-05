import { DoctorScheduleDetail } from './doctorScheduleDetails';

export interface DoctorSchedule {
    id: Number;
    doctor_id: Number;
    date: Date;
    created_at: Date;
    updated_at: Date;
    type: string;
    listScheduleDetails: DoctorScheduleDetail[];
}
