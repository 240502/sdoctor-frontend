import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';

export const useFetchCommonDoctors = () => {
    return useQuery({
        queryKey: ['fetchCommonDoctors'],
        queryFn: doctorService.getCommonDoctor,
        select: (response) => ({
            doctors: response.data,
        }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
