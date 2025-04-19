import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { invoicesService } from '../../services';
import { Invoices } from '../../models';

export const useFetchInoivceByAppointmentId = (
    appointmentId: number
): UseQueryResult<Invoices, Error> => {
    return useQuery<Invoices, Error>({
        queryKey: ['useFetchInvoiceByAppointmentId', appointmentId],
        queryFn: () => invoicesService.getInvoiceByAppointmentId(appointmentId),
    });
};
