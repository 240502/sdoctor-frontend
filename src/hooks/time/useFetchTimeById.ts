import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { timeService } from '../../services';
import { Time } from '../../models/time';

export const useFetchTimeByType = (
    timeType: number
): UseQueryResult<Time[], Error> => {
    return useQuery<Time[], Error>({
        queryKey: ['useFetchTimeByType', JSON.stringify(timeType)],
        queryFn: async () =>
            timeService.getTimeByTimeType({ timeType: timeType }),
    });
};
