import { useMutation } from '@tanstack/react-query';
import { appointmentService } from '../../services';

export const useUpdateIsEvaluationAppointment = () => {
    return useMutation({
        mutationKey: ['useUpdateIsEvaluationAppointment'],
        mutationFn: (appointmentId: number) =>
            appointmentService.updateIsValuation(appointmentId),
    });
};
