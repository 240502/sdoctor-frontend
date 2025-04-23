import { DoctorScheduleDetail } from './doctor_schedule_details';

export interface Schedules {
    id: number;
    entityId: number;
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
export interface SchedulesResponse {
    data: Schedules[];
    date: Date;
    entityId: number;
    entityType: string;
    updatedScheduleId: number[];
}
