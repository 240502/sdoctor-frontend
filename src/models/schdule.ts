export interface Schedule {
    id: Number;
    subscriber_id: Number;
    date: Date;
    created_at: Date;
    updated_at: Date;
    type: string;
    time: string[];
}
