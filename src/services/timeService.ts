import { apiClient } from '../constants/api';

export const TimeService = {
    async getTimeById(id: string): Promise<any> {
        const res = await apiClient.get('/api/time/get-by-id/' + id);
        return res.data;
    },
};