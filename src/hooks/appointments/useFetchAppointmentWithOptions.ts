import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';

interface AppointmentResponse {
    appointments: AppointmentResponse[];
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems: number;
}
export const useFetchAppointmentWithOptions = (payload: {
    pageIndex: number;
    pageSize: number;
    status: number;
}): UseQueryResult<AppointmentResponse, Error> => {
    return useQuery<AppointmentResponse, Error>({
        queryKey: ['useFetchAppointmentWithOptions', payload],
        queryFn: async () =>
            appointmentService.getAppointmentWithOptions(payload),
    });
};
