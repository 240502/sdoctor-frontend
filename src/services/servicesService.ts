import { apiClient } from '../constants/api';

export const ServicesService = {
    async getServiceView(data: any): Promise<any> {
        const res = await apiClient.post('/api/service/view', data);
        return res?.data;
    },
};
