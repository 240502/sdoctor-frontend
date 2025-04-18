import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { mailerService } from '../../services';

type SendBookingSuccessMailResponse = {
    success: boolean;
    message: string;
    sendBookingSuccessMail?: any;
};

interface SendBookingSuccessMailPayload {
    patientName: string;
    email: string;
    doctorName: string;
    time: string;
    date: string;
    location: string;
    status: string;
    fee: number;
    serviceName: string;
}
export const useSendBookingSuccessMail = (): UseMutationResult<
    SendBookingSuccessMailResponse, // Response type
    Error, // Error type
    SendBookingSuccessMailPayload // Payload etyp
> => {
    return useMutation<
        SendBookingSuccessMailResponse,
        Error,
        SendBookingSuccessMailPayload
    >({
        mutationFn: async (payload: SendBookingSuccessMailPayload) => {
            return await mailerService.sendBookingSuccessMail(payload);
        },
        onSuccess(data, variables, context) {
            console.log('send mail success', data);
        },
    });
};
