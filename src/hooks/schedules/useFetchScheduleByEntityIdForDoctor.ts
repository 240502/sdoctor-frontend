import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { scheduleService } from '../../services';
import { SchedulesResponse } from '../../models';

export const useFetchSchedulesByEntityIdForDoctor = (payload: {
    entityId: number;
    date: string;
    entityType: string;
}): UseQueryResult<SchedulesResponse, Error> => {
    return useQuery<SchedulesResponse, Error>({
        queryKey: ['useFetchSchedulesByEntityIdForDoctor', payload],
        queryFn: async () => {
            console.log('Calling API with payload:', payload);
            const response =
                await scheduleService.getScheduleByEntityIdForDoctor(payload);
            console.log('API response:', response);
            return response;
        },
        retry: false,
    });
};
