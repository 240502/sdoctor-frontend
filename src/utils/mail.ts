import { MailerService } from '../services/mailer.service';

export const sendRejectionMail = async (mailBody: any) => {
    try {
        const res = await MailerService.sendRejectionMail(mailBody);
        console.log(res);
    } catch (err: any) {
        console.log(err.message);
    }
};

export const sendConfirmingSuccessMail = async (mailBody: any) => {
    try {
        const res = await MailerService.sendConfirmingSuccessMail(mailBody);
        console.log(res);
    } catch (err: any) {
        console.log(err.message);
    }
};
