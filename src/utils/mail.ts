import { mailerService } from '../services/';

export const sendRejectionMail = async (mailBody: any) => {
    try {
        const res = await mailerService.sendRejectionMail(mailBody);
        console.log(res);
    } catch (err: any) {
        console.log(err.message);
    }
};

export const sendConfirmingSuccessMail = async (mailBody: any) => {
    try {
        const res = await mailerService.sendConfirmingSuccessMail(mailBody);
        console.log(res);
    } catch (err: any) {
        console.log(err.message);
    }
};
