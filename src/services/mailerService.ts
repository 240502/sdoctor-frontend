import { nestApi } from '../constants/api';

export const MailerService = {
    async sendBookingSuccessMail(data: any): Promise<any> {
        const res = await nestApi.post('/mailer/send-booking-success', data);
        return res;
    },
};
