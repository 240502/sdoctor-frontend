export interface Notifications {
    id: number;
    user_id: number;
    message: string;
    is_read: number;
    created_at: Date;
    appointment_id: number;
    timeAgo: string;
}
