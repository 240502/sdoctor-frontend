import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useFetchClinicsWithPagination = (payload: {
    pageIndex?: number;
    pageSize?: number;
}) => {
    return useInfiniteQuery({
        queryKey: ['useFetchClinicsWithPagination', JSON.stringify(payload)],
        queryFn: async ({ pageParam = 1 }) => {
            return await clinicService.viewClinic({
                ...payload,
                pageSize: payload.pageSize,
                pageIndex: pageParam,
            });
        },
        retry: 1,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { page, pageCount } = lastPage;
            return page < pageCount ? page + 1 : undefined;
        },
        placeholderData: (previousData) =>
            previousData ?? { pages: [], pageParams: [] },
    });
};
