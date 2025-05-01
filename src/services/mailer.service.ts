import apiClient from '../constants/api';

const mailerService = {
    async sendBookingSuccessMail(data: any): Promise<any> {
        const res = await apiClient.post(
            '/mailer/send-booking-success-mail',
            data
        );
        return res;
    },

    async sendConfirmingSuccessMail(data: any): Promise<any> {
        const res = await apiClient.post(
            '/mailer/send-confirm-success-mail',
            data
        );
        return res;
    },
    async sendRejectionMail(data: any): Promise<any> {
        const res = await apiClient.post('/mailer/send-rejection-mail', data);
        return res;
    },
};
export default mailerService;
