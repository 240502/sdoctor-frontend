import { useQuery } from '@tanstack/react-query';
import { MajorService } from '../../services';

export const useFetchCommonSpecialization = () => {
    return useQuery({
        queryKey: ['fetchCommonSpecialization'],
        queryFn: MajorService.getCommonMajor,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
