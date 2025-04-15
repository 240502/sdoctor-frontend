import { useMutation } from '@tanstack/react-query';
import { scheduleService } from '../../services';

export const useUpdateScheduleStatus = () => {
    return useMutation({
        mutationFn: async (scheduleId: number) => {
            return await scheduleService.updateScheduleStatus(scheduleId);
        },
        onSuccess(data, variables, context) {
            console.log('Update schedule status success', data);
            console.log('Update schedule status variables', variables);
            console.log('Update schedule status context', context);
        },
    });
};
