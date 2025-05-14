import { useQuery } from '@tanstack/react-query';
import educationService from '../../services/education.service';

export const useFetchEducationByDoctorId = (doctorId: number | null) => {
    return useQuery({
        queryKey: ['useFetchEducationByDoctorId', doctorId],
        queryFn: () => educationService.getEducationByDoctorId(doctorId),
        retry: false,
    });
};
