import { apiClient, nestApi } from '../constants/api';

export const scheduleService = {
    async viewSchedule(data: object): Promise<any> {
        const res = await nestApi.post('/doctor-schedule/view', data);
        return res.data;
    },

    async createSchedule(data: any, config: any): Promise<any> {
        const res = await nestApi.post('/doctor-schedule/create', data, config);
        return res;
    },
    async updateSchedule(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/api/doctor-schedule/update',
            data,
            config
        );
        return res;
    },
};
