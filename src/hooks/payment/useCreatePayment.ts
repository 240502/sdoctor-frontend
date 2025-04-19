import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../../services';

export const useCreatePayment = () => {
    return useMutation({
        mutationKey: ['useCreatePayment'],
        mutationFn: (appointmentId: number) =>
            paymentService.create(appointmentId),
        onSuccess: (data) => {
            window.location.href = data.data.order_url;
            console.log('data create payment', data);
        },
    });
};
