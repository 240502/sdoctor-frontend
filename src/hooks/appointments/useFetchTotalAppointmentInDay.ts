import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

interface ApiResponse {
    totalPatient: number;
}
export const useFetchTotalAppointmentInDay = (doctorId: number) => {
    return useQuery<ApiResponse, Error>({
        queryKey: ['useFetchTotalAppointmentInDay', doctorId],
        queryFn: async () => appointmentService.getTotalPatientInDay(doctorId),
        retry: 0,
    });
};
