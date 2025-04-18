import { DoctorScheduleDetail } from './doctor_schedule_details';

export interface Schedules {
    id: Number;
    entityId: Number;
    entityType: string;
    date: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    timeId: number;
    startTime: string;
    endTime: string;
}

export interface SchedulesCreate {
    entityId: Number;
    entityType: string;
    date: string;
    timeId: number;
}
