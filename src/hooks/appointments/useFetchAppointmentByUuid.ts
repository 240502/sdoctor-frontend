import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { Appointment } from '../../models';

interface PayloadType {
    uuid: string;
    pageIndex?: number;
    pageSize?: number;
}
export const useFetchAppointmentByUuid = (
    payload: PayloadType
): UseQueryResult<Appointment[], Error> => {
    return useQuery<Appointment[], Error>({
        queryKey: ['useFetchAppointmentByUuid', payload],
        queryFn: () => appointmentService.getAppointmentByUuid(payload),
        refetchOnWindowFocus: false,
        retry: false,
    });
};
