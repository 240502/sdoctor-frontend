import apiClient from '../constants/api';

const notificationService = {
    async getNotificationByUserId(userId: number): Promise<any> {
        const res = await apiClient.get(
            '/notification/get-by-user-id/' + userId
        );
        return res.data;
    },
    async markAsRead(id: number): Promise<any> {
        const res = await apiClient.put('/notifications/mark-as-read/' + id);
        return res;
    },
    async markAllRead(userId: number): Promise<any> {
        const res = await apiClient.put(
            '/notification/mark-all-read/' + userId
        );
        return res;
    },
    async createNotification(data: any): Promise<any> {
        const res = await apiClient.post('/notification/create', data);
        return res;
    },
    async deleteNotification(id: number): Promise<any> {
        const res = await apiClient.delete('/notification/delete/' + id);
        return res;
    },
};
export default notificationService;
