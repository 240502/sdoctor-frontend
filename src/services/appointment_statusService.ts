import { apiClient } from '../constants/api';

export const AppointmentStatusService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('api/appointment-status/get-all');
        return res.data;
    },
};
