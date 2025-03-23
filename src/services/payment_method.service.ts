import { apiClient } from '../constants/api';

const paymentMethodService = {
    async getAllPaymentMethod(): Promise<any> {
        const res = await apiClient.get('/payment-method/get-all');
        return res;
    },
};
export default paymentMethodService;
