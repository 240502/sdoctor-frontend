import { useQuery } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useFetchClinicById = (id: number | null) => {
    return useQuery({
        queryKey: ['useFetchClinicById', JSON.stringify(id)],
        queryFn: async () => {
            return await clinicService.getClinicById(id);
        },
        retry: false,
        placeholderData: (previousData) => previousData || {},
    });
};
