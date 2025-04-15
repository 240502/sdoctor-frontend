import { useMutation } from '@tanstack/react-query';
import { SchedulesCreate } from '../../models';
import scheduleService from '../../services/schedules.service';
export const useCreateSchedules = (config: any) => {
    return useMutation({
        mutationFn: (newSchedule: SchedulesCreate[]) => {
            return scheduleService.createSchedule(newSchedule, config);
        },
        onSuccess: (data) => {
            console.log('Create schedule success', data);
        },
    });
};
