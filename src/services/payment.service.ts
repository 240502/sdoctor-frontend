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
};
export default paymentService;
