import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';

export const useFetchAppointmentAtInvoice = (
    invoiceId: number
): UseQueryResult<AppointmentResponseDto, Error> => {
    return useQuery<AppointmentResponseDto, Error>({
        queryKey: ['useFetchAppointmentAtInvoice', invoiceId],
        queryFn: async () =>
            appointmentService.getAppointmentAtInvoice(invoiceId),
    });
};
