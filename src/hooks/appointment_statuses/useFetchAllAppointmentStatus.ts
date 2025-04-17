import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { appointmentStatusService } from '../../services';
import { AppointmentStatus } from '../../models';

export const useFetchAllAppointmentStatus = (): UseQueryResult<
    AppointmentStatus,
    Error
> => {
    return useQuery<AppointmentStatus, Error>({
        queryKey: ['useFetchAllAppointmentStatus'],
        queryFn: () => appointmentStatusService.getAll(),
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutesqu
    });
};
