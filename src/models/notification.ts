export interface Notifications {
    id: number;
    userId: number | null;
    message: string | null;
    isRead: number | null;
    createdAt: Date;
    appointmentId: number | null;
    timeAgo: string | null;
    recordCount: number | null;
}

export interface NotificationCreate {
    userId: number;
    message: string;
    appointmentId: number | null;
}
