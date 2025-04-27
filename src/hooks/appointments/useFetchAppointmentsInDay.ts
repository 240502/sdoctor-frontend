import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';

export const useFetchAppointmentsInDay = (
    doctorId: number
): UseQueryResult<AppointmentResponseDto[], Error> => {
    return useQuery<AppointmentResponseDto[], Error>({
        queryKey: ['useFetchAppointmentsInDay', doctorId],
        queryFn: async () => {
            const res = await appointmentService.getAppointmentsInDay(doctorId);
            console.log('response', res);
            return res;
        },
    });
};
