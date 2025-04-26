import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { mailerService } from '../../services';
import { SendBookingSuccessMailPayload } from '../../models';

type SendBookingSuccessMailResponse = {
    success: boolean;
    message: string;
    sendBookingSuccessMail?: any;
};

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
        onError(error, variables, context) {
            console.log(
                'Có lỗi khi gửi mail thông báo đăng ký thành công',
                error
            );
        },
    });
};
