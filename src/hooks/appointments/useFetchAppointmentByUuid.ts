import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';
import { Dayjs } from 'dayjs';
interface PayloadType {
    uuid: string;
    pageIndex?: number;
    pageSize?: number;
    status?: number;
    fromDate?: Dayjs;
    toDate?: Dayjs;
}
interface AppointmentResponse {
    appointments: AppointmentResponseDto[];
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems: number;
}

export const useFetchAppointmentByUuid = (
    payload: PayloadType
): UseQueryResult<AppointmentResponse, Error> => {
    return useQuery<AppointmentResponse, Error>({
        queryKey: ['useFetchAppointmentByUuid', payload],
        queryFn: () => appointmentService.getAppointmentByUuid(payload),

        refetchOnWindowFocus: false,
        retry: false,
    });
};
