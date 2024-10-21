import { apiClient } from '../constants/api';

export const scheduleService = {
    async getBySubscriberIdAndDate(data: object): Promise<any> {
        const res = await apiClient.post(
            '/api/schedule/get-by-subscriber-id-date',
            data
        );
        return res.data;
    },
    async createSchedule(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/schedule/create', data, config);
        return res;
    },
};
