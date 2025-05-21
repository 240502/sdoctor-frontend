import { useQuery } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useFetchClinicForAdmin = (payload: {
    pageIndex: number;
    pageSize: number;
}) => {
    return useQuery({
        queryKey: ['useFetchClinicForAdmin', payload],
        queryFn: () => clinicService.viewClinic(payload),
        select: (data) => ({
            clinics: data.data,
            pageCount: data.pageCount,
        }),
    });
};
