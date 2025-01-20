import { DoctorScheduleDetail } from './doctorScheduleDetails';

export interface DoctorSchedule {
    id: Number;
    doctorId: Number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    doctorScheduleDetails: DoctorScheduleDetail[];
}
