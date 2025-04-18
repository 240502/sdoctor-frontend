import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';

interface PayloadType {
    uuid: string;
    pageIndex?: number;
    pageSize?: number;
    status?: number;
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
