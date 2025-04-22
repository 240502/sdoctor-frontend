import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentCreate, AppointmentResponseDto } from '../../models';

type CreateAppointmentResponse = {
    success: boolean;
    message: string;
    data: { message: string; result: AppointmentResponseDto };
    updatedAppointment?: any; // Hoặc bạn có thể thay `any` bằng type thực tế
};

export const useCreateAppointment = (): UseMutationResult<
    CreateAppointmentResponse, // Response type
    Error, // Error type
    AppointmentCreate // Payload etyp
> => {
    return useMutation<
        CreateAppointmentResponse, // Response type
        Error, // Error type
        AppointmentCreate // Payload etyp
    >({
        mutationFn: async (newAppointment: AppointmentCreate) => {
            return await appointmentService.createAppointment(newAppointment);
        },
        onSuccess(data, variables, context) {},
    });
};
