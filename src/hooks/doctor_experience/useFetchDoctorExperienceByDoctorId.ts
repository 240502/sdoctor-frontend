import { useQuery } from '@tanstack/react-query';
import { workExperienceService } from '../../services';

export const useFetchDoctorExperienceByDoctorId = (doctorId: number | null) => {
    return useQuery({
        queryKey: ['useFetchDoctorExperienceByDoctorId', doctorId],
        queryFn: () =>
            workExperienceService.getWorkExperienceByDoctorId(doctorId),
        retry: false,
    });
};
