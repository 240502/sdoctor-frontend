import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { scheduleService } from '../../services';
import { SchedulesResponse } from '../../models';

export const useFetchSchedulesByEntityIdForDoctor = (payload: {
    entityId: number;
    date: string;
    entityType: string;
}): UseQueryResult<SchedulesResponse, Error> => {
    return useQuery<SchedulesResponse, Error>({
        queryKey: [
            'useFetchSchedulesByEntityIdForDoctor',
            JSON.stringify(payload),
        ],
        queryFn: async () => {
            return await scheduleService.getScheduleByEntityIdForDoctor(
                payload
            );
        },
        retry: false,
    });
};
