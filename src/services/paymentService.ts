import { apiClient } from '../constants/api';

export const paymentService = {
    async create(data: any): Promise<any> {
        const res = await apiClient.post('/api/payment/create', data);
        return res;
    },
    async callBack(): Promise<any> {
        const res = await apiClient.post('/api/payment/callback');
        return res;
    },
};
