import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';
export const useFetchDoctorsWithPagination = (
    pageIndex: number,
    pageSize: number
) => {
    return useQuery({
        queryKey: ['fetchDoctors', pageIndex, pageSize] as const, // Thay đổi queryKey khi tham số thay đổi
        queryFn: async ({ queryKey }) => {
            return await doctorService.viewDoctorForClient(queryKey);
        },
        select: (response) => ({
            doctors: response.data, // Mảng danh sách bác sĩ
            totalItems: response.totalItems,
            page: response.page,
            pageSize: response.pageSize,
        }),
        staleTime: 1000 * 60 * 5, // 5 phút
        gcTime: 1000 * 60 * 10, // Xóa cache sau 10 phút nếu không dùng
        placeholderData: (previousData) => previousData ?? [], // ✅ Sử dụng dữ liệu cũ nếu có
    });
};
