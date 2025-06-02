import apiClient from '../constants/api';

const paymentService = {
    async create(appointmentId: number): Promise<any> {
        const res = await apiClient.post('/payment/create/' + appointmentId);
        return res;
    },
    async callBack(): Promise<any> {
        const res = await apiClient.post('/payment/callback');
        return res;
    },
    async createVnpay(appointmentId: number): Promise<any> {
        const res = await apiClient.post(
            '/payment/vnpay/create/' + appointmentId
        );
        return res;
    },
};
export default paymentService;
