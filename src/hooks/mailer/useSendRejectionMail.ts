import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { mailerService } from '../../services';
import { SendRejectionMailPayload } from '../../models';

type SendRejectionMailResponse = {
    success: boolean;
    message: string;
    sendBookingSuccessMail?: any;
};

export const useSendRejectionSuccessMail = (): UseMutationResult<
    SendRejectionMailResponse, // Response type
    Error, // Error type
    SendRejectionMailPayload // Payload etyp
> => {
    return useMutation<
        SendRejectionMailResponse, // Response type
        Error,
        SendRejectionMailPayload
    >({
        mutationFn: async (payload: SendRejectionMailPayload) => {
            return await mailerService.sendRejectionMail(payload);
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
