import { useQuery } from '@tanstack/react-query';
import { DoctorService } from '../../models';
import { doctorServiceService } from '../../services';

export const useFetchAllDoctorService = () => {
    return useQuery<DoctorService[], Error>({
        queryKey: ['useFetchAllDoctorService'],
        queryFn: doctorServiceService.getAll,
    });
};
