import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { medicalPackageService } from '../../services';
import { MedicalPackage, MedicalPackageOptions } from '../../models';

interface PaginatedMedicalPackage {
    medicalPackages: MedicalPackage[];
    pageIndex: number;
    pageCount: number;
    totalItems: number;
}

export const useFetchMedicalPackageWithPaginationAndOptions = (
    payload: MedicalPackageOptions
): UseInfiniteQueryResult<InfiniteData<PaginatedMedicalPackage>, Error> => {
    return useInfiniteQuery<PaginatedMedicalPackage, Error>({
        queryKey: [
            'useFetchMedicalPackageWithPaginationAndOptions',
            JSON.stringify(payload),
        ],
        queryFn: async ({ pageParam = 1 }) =>
            medicalPackageService.viewService({
                ...payload,
                pageSize: 6,
                pageIndex: pageParam,
            }),
        initialPageParam: 1,
        retry: 1,
        getNextPageParam: (lastPage) => {
            const { pageIndex, pageCount } = lastPage;
            return pageIndex < pageCount ? pageIndex + 1 : undefined;
        },
    });
};
