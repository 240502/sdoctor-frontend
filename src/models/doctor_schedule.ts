import { DoctorScheduleDetail } from './doctor_schedule_details';

export interface DoctorSchedule {
    id: Number;
    doctorId: Number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    doctorScheduleDetails: DoctorScheduleDetail[];
}
