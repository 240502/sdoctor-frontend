import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { mailerService } from '../../services';
import { SendConfirmSuccessMailPayload } from '../../models';

type SendConfirmSuccessMailResponse = {
    success: boolean;
    message: string;
    sendBookingSuccessMail?: any;
};

export const useSendConfirmSuccessMail = (): UseMutationResult<
    SendConfirmSuccessMailResponse, // Response type
    Error, // Error type
    SendConfirmSuccessMailPayload // Payload etyp
> => {
    return useMutation<
        SendConfirmSuccessMailResponse,
        Error,
        SendConfirmSuccessMailPayload
    >({
        mutationFn: async (payload: SendConfirmSuccessMailPayload) => {
            return await mailerService.sendConfirmingSuccessMail(payload);
        },
        onSuccess(data) {
            console.log('send mail success', data);
        },
        onError(error) {
            console.log(
                'Có lỗi khi gửi mail thông báo đăng ký thành công',
                error
            );
        },
    });
};
