import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

interface ApiResponse {
    totalPatient: number;
}
export const useFetchWaitingPatientsCount = (doctorId: number) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['useFetchWaitingPatientsCount', doctorId],
        queryFn: async () =>
            appointmentService.getWaitingPatientsCount(doctorId),
        retry: 0,
    });
};
