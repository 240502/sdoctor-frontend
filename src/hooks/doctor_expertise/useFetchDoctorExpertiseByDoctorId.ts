import { useQuery } from '@tanstack/react-query';
import { doctorExpertisesService } from '../../services';

export const useFetchDoctorExpertiseByDoctorId = (doctorId: number | null) => {
    return useQuery({
        queryKey: ['useFetchDoctorExpertiseByDoctorId', doctorId],
        queryFn: () =>
            doctorExpertisesService.getDoctorExpertisesByDoctorId(doctorId),
    });
};
