import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { SchedulesResponse } from '../../models';
import { scheduleService } from '../../services';

export const useFetchSchedulesByEntityIdAndDate = (payload: {
    entityId: number;
    date: string;
    entityType: string;
}): UseQueryResult<SchedulesResponse, Error> => {
    return useQuery<SchedulesResponse, Error>({
        queryKey: ['useFetchSchedulesByEntityId', JSON.stringify(payload)],
        queryFn: async () => {
            return await scheduleService.getScheduleByEntityId(payload);
        },
        retry: false,
    });
};
