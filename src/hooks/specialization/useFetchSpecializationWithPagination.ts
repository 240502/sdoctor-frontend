import { useQuery } from '@tanstack/react-query';
import { majorService } from '../../services';

export const useFetchSpecializationsWithPagination = (payload: {
    pageIndex?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ['fetchSpecializationsWithPagination'],
        queryFn: async () => {
            return await majorService.viewMajor(payload);
        },
        select: (response) => ({
            majors: response.data,
            totalItems: response.totalItems,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
            pageCount: response.pageCount,
        }),
        placeholderData: (previousData) => previousData ?? [], // ✅ Sử dụng dữ liệu cũ nếu có
    });
};
