import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Appointment, AppointmentResponseDto } from '../../models';
import { appointmentService } from '../../services';

export const useFetchAppointmentById = (
    appointmentId: number | null
): UseQueryResult<AppointmentResponseDto, Error> => {
    return useQuery<AppointmentResponseDto, Error>({
        queryKey: ['useFetchAppointmentById', appointmentId],
        queryFn: async () =>
            appointmentService.getAppointmentById(appointmentId),
    });
};
