import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AppointmentResponseDto } from '../../models';
import { appointmentService } from '../../services';

interface FetchRecentAppointmentsResponse {
    entityId: number;
    appointments: AppointmentResponseDto[];
    limit: number;
    withoutId: number;
}

export const useFetchRecentAppointments = (payload: {
    entityId: number;
    limit: number;
    withoutId: number;
}): UseQueryResult<FetchRecentAppointmentsResponse, Error> => {
    return useQuery<FetchRecentAppointmentsResponse, Error>({
        queryKey: ['useFetchRecentAppointments', payload],
        queryFn: async () => appointmentService.getRecentAppointments(payload),
    });
};
