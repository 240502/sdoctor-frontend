import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';
import { DoctorOptions } from '../../models';

export const useFetchDoctorForAdmin = (payload: DoctorOptions) => {
    return useQuery({
        queryKey: ['useFetchDoctorForAdmin', payload],
        queryFn: () => doctorService.viewDoctorForClient(payload),
        select: (response) => ({
            doctors: response.data,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
            pageCount: response.pageCount,
        }),
    });
};
