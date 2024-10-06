import { ScheduleDetails } from './schedule_details';

export interface Schedule {
    id: Number;
    subscriber_id: Number;
    date: Date;
    created_at: Date;
    updated_at: Date;
    type: string;
    listScheduleDetails: ScheduleDetails[];
}
