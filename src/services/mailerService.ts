import { nestApi } from '../constants/api';

export const MailerService = {
    async sendBookingSuccessMail(data: any): Promise<any> {
        const res = await nestApi.post('/mailer/send-booking-success', data);
        return res;
    },

    async sendConfirmingSuccessMail(data: any): Promise<any> {
        const res = await nestApi.post('/mailer/send-confirming-success', data);
        return res;
    },
    async sendRejectionMail(data: any): Promise<any> {
        const res = await nestApi.post('/mailer/send-rejection', data);
        return res;
    },
};
