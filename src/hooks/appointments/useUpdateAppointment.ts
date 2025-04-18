import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { appointmentService } from '../../services';
import { AppointmentResponseDto } from '../../models';

type UpdateAppointmentResponse = {
    success: boolean;
    message: string;
    updatedAppointment?: any; // Hoặc bạn có thể thay `any` bằng type thực tế
};
interface UpdateAppointmentPayload {
    appointment: AppointmentResponseDto;
    requirementObject: string;
}
export const useUpdateAppointmentStatus = (): UseMutationResult<
    UpdateAppointmentResponse, // Response type
    Error, // Error type
    UpdateAppointmentPayload // Payload etyp
> => {
    return useMutation<
        UpdateAppointmentResponse,
        Error,
        UpdateAppointmentPayload
    >({
        mutationFn: async (payload) => {
            return await appointmentService.updateAppointmentStatus(payload);
        },
        onSuccess(data, variables, context) {
            console.log('Update appointment success', data);
            console.log('Update appointment variables', variables);
        },
    });
};
