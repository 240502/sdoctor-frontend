import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services';

export const useStatisticAppointmentByDay = (payload: any) => {
    return useQuery({
        queryKey: ['useStatisticAppointmentByDay', payload],
        queryFn: async () =>
            appointmentService.useStatisticAppointmentByDay(payload),
    });
};
