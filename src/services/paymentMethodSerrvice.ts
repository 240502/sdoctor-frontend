import { apiClient } from '../constants/api';

export const PaymentMethodService = {
    async getAllPaymentMethod(): Promise<any> {
        const res = await apiClient.get('/api/payment-method/get-all');
        return res;
    },
};
