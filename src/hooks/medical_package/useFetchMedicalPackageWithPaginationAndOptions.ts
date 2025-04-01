import { useInfiniteQuery } from '@tanstack/react-query';
import { medicalPackageService } from '../../services';
import { MedicalPackageOptions } from '../../models';

export const useFetchMedicalPackageWithPaginationAndOptions = (
    payload: MedicalPackageOptions
) => {
    return useInfiniteQuery({
        queryKey: [
            'useFetchMedicalPackageWithPaginationAndOptions',
            JSON.stringify(payload),
        ],
        queryFn: async ({ pageParam = 1 }) =>
            medicalPackageService.viewService({
                ...payload,
                pageIndex: pageParam,
            }),
        initialPageParam: 1,
        retry: 1,
        getNextPageParam: (lastPage) => {
            const { page, pageCount } = lastPage;
            return page < pageCount ? page + 1 : undefined;
        },
    });
};
