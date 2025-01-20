import { apiClient, nestApi } from '../constants/api';

export const AppointmentStatusService = {
    async getAll(): Promise<any> {
        const res = await nestApi.get('/appointment-status/get-all');
        return res.data;
    },
};
