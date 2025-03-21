import { useInfiniteQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';
import { DoctorOptions } from '../../models/doctor';

export const useFetchDoctorsWithPagination = (payload: DoctorOptions) => {
    return useInfiniteQuery({
        queryKey: [
            'fetchDoctorsWithPaginationAndFilters',
            JSON.stringify(payload),
        ],

        queryFn: async ({ pageParam = 1 }) => {
            return await doctorService.viewDoctorForClient({
                ...payload,
                pageIndex: pageParam, // ✅ Gửi pageIndex đúng theo `pageParam`
            });
        },
        retry: 1,
        initialPageParam: 1, // ✅ Thêm `initialPageParam` để sửa lỗi
        getNextPageParam: (lastPage) => {
            const { page, pageCount } = lastPage;
            return page < pageCount ? page + 1 : undefined; // ✅ Nếu còn trang tiếp theo, trả về số trang tiếp theo
        },

        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
        gcTime: 1000 * 60 * 10, // Xóa cache sau 10 phút nếu không dùng
        placeholderData: (previousData) =>
            previousData ?? { pages: [], pageParams: [] },
    });
};
