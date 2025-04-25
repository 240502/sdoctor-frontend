import { useMutation } from '@tanstack/react-query';
import { CreateSchedulesResponse, SchedulesCreate } from '../../models';
import scheduleService from '../../services/schedules.service';
export const useCreateSchedules = (config: any) => {
    return useMutation<
        CreateSchedulesResponse, // Kiểu dữ liệu trả về
        Error, // Kiểu lỗi
        SchedulesCreate[]
    >({
        mutationFn: (newSchedule: SchedulesCreate[]) => {
            return scheduleService.createSchedule(newSchedule, config);
        },
        onSuccess: (data: CreateSchedulesResponse) => {
            if (data.success) {
                console.log('success');
            }
        },
        onError: (error: Error) => {
            console.error('Failed to create schedules:', error);
        },
    });
};
