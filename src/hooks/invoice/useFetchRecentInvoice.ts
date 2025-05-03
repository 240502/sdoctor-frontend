import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Invoices } from '../../models';
import { invoicesService } from '../../services';

export const useFetchRecentInvoice = (
    userId: number
): UseQueryResult<Invoices[], Error> => {
    return useQuery<Invoices[], Error>({
        queryKey: ['useFetchRecentInvoice'],
        queryFn: async () => invoicesService.getRecentInvoice(userId),
    });
};
