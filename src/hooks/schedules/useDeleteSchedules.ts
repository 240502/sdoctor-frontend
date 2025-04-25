import { useMutation, useQueryClient } from '@tanstack/react-query';

import { scheduleService } from '../../services';
import { DeleteSchedulesResponse } from '../../models';

export const useDeleteSchedules = (config: any) => {
    return useMutation<DeleteSchedulesResponse, Error, number[]>({
        mutationKey: ['useDeleteSchedules'],
        mutationFn: async (ids: number[]) =>
            scheduleService.deleteSchedules(ids, config),
        onSuccess: (data: DeleteSchedulesResponse) => {
            if (data.success) {
                console.log('success');
            }
        },
        onError: (error: Error) => {
            console.error('Failed to delete schedules:', error);
        },
    });
};
