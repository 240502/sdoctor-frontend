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
    date: Date | string;
    timeId: number;
}
export interface SchedulesResponse {
    data: Schedules[];
    date: Date;
    entityId: number;
    entityType: string;
    updatedScheduleId: number[];
}
// Định nghĩa kiểu trả về cho API xóa
export interface DeleteSchedulesResponse {
    success: boolean;
    message?: string;
}

// Định nghĩa kiểu trả về cho API thêm
export interface CreateSchedulesResponse {
    success: boolean;
    schedules: Schedules[];
    message?: string;
}
