import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';
import { CommonDoctorOptions } from '../../models';

export const useFetchCommonDoctors = (payload: CommonDoctorOptions) => {
    return useQuery({
        queryKey: ['fetchCommonDoctors', JSON.stringify(payload)],
        queryFn: async () => {
            return await doctorService.getCommonDoctor(payload);
        },
        select: (response) => ({
            doctors: response.data,
            pageCount: response.pageCount,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
        }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
