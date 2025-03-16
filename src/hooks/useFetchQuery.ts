import { useQuery, QueryKey } from '@tanstack/react-query';

interface FetchQueryOptions<T> {
    queryKey: QueryKey; // Khóa để cache dữ liệu
    queryFn: () => Promise<T>; // Hàm fetch API
    staleTime?: number; // Thời gian cache hợp lệ
}

export const useFetchQuery = <T>({
    queryKey,
    queryFn,
    staleTime = 300000,
}: FetchQueryOptions<T>) => {
    return useQuery<T>({
        queryKey,
        queryFn,
        staleTime, // Mặc định 5 phút
    });
};
