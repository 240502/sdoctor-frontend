import { apiClient } from '../constants/api';

export const NotificationService = {
    async getNotificationByUserId(userId: number): Promise<any> {
        const res = await apiClient.get(
            '/api/notification/get-by-user-id/' + userId
        );
        return res.data;
    },
    async markAsRead(id: number): Promise<any> {
        const res = await apiClient.put('/api/notification/mark-as-read/' + id);
        return res;
    },
    async markAllRead(userId: number): Promise<any> {
        const res = await apiClient.put(
            '/api/notification/mark-all-read/' + userId
        );
        return res;
    },
    async createNotification(data: any): Promise<any> {
        const res = await apiClient.post('/api/notification/create', data);
        return res;
    },
    async deleteNotification(id: number): Promise<any> {
        const res = await apiClient.delete('/api/notification/delete/' + id);
        return res;
    },
};
