import { useQuery } from '@tanstack/react-query';
import { degreesService } from '../../services';

export const useFetchAllDegrees = () => {
    return useQuery({
        queryKey: ['useFetchAllDegrees'],
        queryFn: degreesService.getAllDegrees,
    });
};
