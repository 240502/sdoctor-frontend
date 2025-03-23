import { useQuery } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useFetchClinicsWithPagination = (payload: {
    pageIndex?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ['useFetchClinicsWithPagination'],
        queryFn: async () => {
            return await clinicService.viewClinic(payload);
        },
        select: (response) => ({
            clinics: response.data,
            totalItems: response.totalItems,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
            pageCount: response.pageCount,
        }),
        placeholderData: (previousData) => previousData ?? [], // ✅ Sử dụng dữ liệu cũ nếu có
    });
};
