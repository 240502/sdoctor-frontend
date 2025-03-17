import { apiClient } from '../constants/api';

export const MailerService = {
    async sendBookingSuccessMail(data: any): Promise<any> {
        const res = await apiClient.post('/mailer/send-booking-success', data);
        return res;
    },

    async sendConfirmingSuccessMail(data: any): Promise<any> {
        const res = await apiClient.post(
            '/mailer/send-confirming-success',
            data
        );
        return res;
    },
    async sendRejectionMail(data: any): Promise<any> {
        const res = await apiClient.post('/mailer/send-rejection', data);
        return res;
    },
};
