import { AxiosResponse } from 'axios';
import apiClient from '../constants/api';
import { CreateSchedulesResponse, Schedules } from '../models';

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

    async createSchedule(
        data: any,
        config: any
    ): Promise<CreateSchedulesResponse> {
        const res: AxiosResponse<CreateSchedulesResponse> =
            await apiClient.post('/schedule/create', data, config);
        return res.data;
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
    async getScheduleByEntityIdForDoctor(payload: {
        entityId: number;
        date: string;
        entityType: string;
    }): Promise<Schedules[] | any> {
        const res = await apiClient.get(
            `/schedule/get-schedule-by-entityid-for-doctor?entityId=${payload.entityId}&date=${payload.date}&entityType=${payload.entityType}`
        );
        return res?.data;
    },
    async deleteSchedules(ids: number[], config: any): Promise<any> {
        const res = await apiClient.post(
            '/schedule/delete-schedules',
            ids,
            config
        );
        return res;
    },
};
export default scheduleService;
