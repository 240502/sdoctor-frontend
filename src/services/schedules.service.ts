import { apiClient } from '../constants/api';

const scheduleService = {
    async getScheduleByEntityId(payload: {
        entityId: number;
        entityType: string;
        date: string;
    }): Promise<any> {
        const res = await apiClient.post(
            '/schedule/get-schedules-by-entityId',
            payload
        );
        return res.data;
    },

    async createSchedule(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/schedule/create', data, config);
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
    async updateScheduleStatus(dataArr: any): Promise<any> {
        const res = await apiClient.put(
            '/schedule/update-schedule-status',
            dataArr
        );
        return res;
    },
};
export default scheduleService;
