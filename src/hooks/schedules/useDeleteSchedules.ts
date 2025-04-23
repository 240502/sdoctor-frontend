import { useMutation } from '@tanstack/react-query';

import { scheduleService } from '../../services';

export const deleteSchedules = () => {
    return useMutation({
        mutationKey: ['useDeleteSchedules'],
        mutationFn: async (ids: number[]) =>
            scheduleService.deleteSchedules(ids),
    });
};
