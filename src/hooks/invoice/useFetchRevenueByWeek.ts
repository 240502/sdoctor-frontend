import { useQuery } from '@tanstack/react-query';
import { invoicesService } from '../../services';

export const useFetchRevenueByWeek = (payload: any) => {
    return useQuery({
        queryKey: ['useFetchRevenueByWeek', payload],
        queryFn: async () =>
            invoicesService.getTotalRevenueByDateInNowWeek(payload),
    });
};
