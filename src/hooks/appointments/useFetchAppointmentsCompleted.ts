import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

interface ApiResponse {
    totalPatient: number;
}
export const useFetchAppointmentsCompleted = (doctorId: number) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['useFetchAppointmentsCompleted', doctorId],
        queryFn: async () =>
            appointmentService.getTotalAppointmentsCompleted(doctorId),
        retry: 0,
    });
};
