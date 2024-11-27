import { apiClient } from '../constants/api';

export const scheduleService = {
    async viewScheduleForClient(data: object): Promise<any> {
        const res = await apiClient.post('/api/schedule/view-for-client', data);
        return res.data;
    },
    async viewScheduleForDoctor(data: object): Promise<any> {
        const res = await apiClient.post('/api/schedule/view-for-doctor', data);
        return res.data;
    },
    async createSchedule(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/schedule/create', data, config);
        return res;
    },
    async updateSchedule(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/api/schedule/update', data, config);
        return res;
    },
};
