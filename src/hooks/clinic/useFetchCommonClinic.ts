import { useQuery } from '@tanstack/react-query';
import { ClinicService } from '../../services';

export const useFetchCommonClinic = () => {
    return useQuery({
        queryKey: ['useFetchCommonClinic'],
        queryFn: ClinicService.getCommonClinic,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData || [],
    });
};
