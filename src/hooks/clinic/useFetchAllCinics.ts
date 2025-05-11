import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Clinic } from '../../models';
import { clinicService } from '../../services';

export const useFetchAllClinics = (): UseQueryResult<Clinic[], Error> => {
    return useQuery<Clinic[], Error>({
        queryKey: ['useFetchAllClinic'],
        queryFn: () => clinicService.getClinicById(1),
    });
};
