import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services';
import { AppointmentCreate } from '../../models';

type CreateAppointmentResponse = {
    success: boolean;
    message: string;
    updatedAppointment?: any; // Hoặc bạn có thể thay `any` bằng type thực tế
};

export const useCreateAppointment = (): UseMutationResult<
    CreateAppointmentResponse, // Response type
    Error, // Error type
    AppointmentCreate // Payload etyp
> => {
    const navigate = useNavigate();
    return useMutation<
        CreateAppointmentResponse, // Response type
        Error, // Error type
        AppointmentCreate // Payload etyp
    >({
        mutationFn: async (newAppointment: AppointmentCreate) => {
            return await appointmentService.createAppointment(newAppointment);
        },
        onSuccess(data, variables, context) {
            navigate('/booking-success');
            console.log('Create appointment success', data);
            console.log('Create appointment variables', variables);
            console.log('Create appointment context', context);
        },
    });
};
