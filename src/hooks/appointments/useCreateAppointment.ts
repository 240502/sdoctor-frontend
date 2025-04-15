import { useMutation } from '@tanstack/react-query';

import { appointmentService } from '../../services';
import { AppointmentCreate } from '../../models';

export const useCreateAppointment = () => {
    return useMutation({
        mutationFn: async (newAppointment: AppointmentCreate) => {
            return await appointmentService.createAppointment(newAppointment);
        },
        onSuccess(data, variables, context) {
            console.log('Create appointment success', data);
            console.log('Create appointment variables', variables);
            console.log('Create appointment context', context);
        },
    });
};
