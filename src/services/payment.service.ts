import { apiClient } from '../constants/api';

const paymentService = {
    async create(data: any): Promise<any> {
        const res = await apiClient.post('/payment/create', data);
        return res;
    },
    async callBack(): Promise<any> {
        const res = await apiClient.post('/payment/callback');
        return res;
    },
};
export default paymentService;
