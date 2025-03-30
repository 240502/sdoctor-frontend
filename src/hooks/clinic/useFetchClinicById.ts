import { useQuery } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useFetchClinicById = (id: number) => {
    return useQuery({
        queryKey: ['useFetchClinicById', JSON.stringify(id)],
        queryFn: async () => {
            return await clinicService.getClinicById(id);
        },
        retry: 1,
        placeholderData: (previousData) => previousData || {},
    });
};
