import { apiClient, nestApi } from '../constants/api';

export const NotificationService = {
    async getNotificationByUserId(userId: number): Promise<any> {
        const res = await nestApi.get(
            '/notifications/get-by-user-id/' + userId
        );
        return res.data;
    },
    async markAsRead(id: number): Promise<any> {
        const res = await nestApi.put('/notifications/mark-as-read/' + id);
        return res;
    },
    async markAllRead(userId: number): Promise<any> {
        const res = await nestApi.put('/notifications/mark-all-read/' + userId);
        return res;
    },
    async createNotification(data: any): Promise<any> {
        const res = await nestApi.post('/notifications/create', data);
        return res;
    },
    async deleteNotification(id: number): Promise<any> {
        const res = await nestApi.delete('/notifications/delete/' + id);
        return res;
    },
};
