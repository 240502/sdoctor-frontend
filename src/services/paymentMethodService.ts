import { apiClient, nestApi } from '../constants/api';

export const PaymentMethodService = {
    async getAllPaymentMethod(): Promise<any> {
        const res = await nestApi.get('/payment-method/get-all');
        return res;
    },
};
