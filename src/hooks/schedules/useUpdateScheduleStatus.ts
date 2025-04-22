import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { scheduleService } from '../../services';

type UpdateScheduleResponse = {
    success: boolean;
    message: string;
    updatedAppointment?: any; // Hoặc bạn có thể thay `any` bằng type thực tế
};
export const useUpdateScheduleStatus = (
    refetch: any
): UseMutationResult<UpdateScheduleResponse, Error, any> => {
    return useMutation<UpdateScheduleResponse, Error, any>({
        mutationFn: async (dataArr: any) => {
            const response = await scheduleService.updateScheduleStatus(
                dataArr
            );
            // In ra kiểm tra nếu cần
            console.log('🔥 response updateSchedule:', response);
            refetch();
            // Chỉ lấy phần data
            return response.data;
        },
    });
};
