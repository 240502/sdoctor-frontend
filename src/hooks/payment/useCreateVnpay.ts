import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../../services';

export const useCreateVnpay = () => {
    return useMutation({
        mutationKey: ['useCreateVnpay'],
        mutationFn: (appointmentId: number) =>
            paymentService.createVnpay(appointmentId),
        onSuccess: (data) => {
            window.location.href = data.data;
        },
    });
};
