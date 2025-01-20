import { apiClient, nestApi } from '../constants/api';

export const paymentService = {
    async create(data: any): Promise<any> {
        const res = await nestApi.post('/payment/create', data);
        return res;
    },
    async callBack(): Promise<any> {
        const res = await nestApi.post('/payment/callback');
        return res;
    },
};
