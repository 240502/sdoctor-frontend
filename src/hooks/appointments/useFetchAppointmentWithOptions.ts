import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';
import { Dayjs } from 'dayjs';
interface AppointmentResponse {
    appointments: AppointmentResponseDto[];
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems: number;
}
export const useFetchAppointmentWithOptions = (payload: {
    pageIndex: number;
    pageSize: number;
    status: number | null;
    userId: number;
    fromDate: Dayjs;
    toDate: Dayjs;
}): UseQueryResult<AppointmentResponse, Error> => {
    return useQuery<AppointmentResponse, Error>({
        queryKey: ['useFetchAppointmentWithOptions', payload],
        queryFn: async () =>
            appointmentService.getAppointmentWithOptions(payload),
        retry: false,
    });
};
