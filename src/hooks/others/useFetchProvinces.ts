import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ProvinceType } from '../../models';
import { otherService } from '../../services';

export const useFetchProvinces = (): UseQueryResult<ProvinceType[], Error> => {
    return useQuery<ProvinceType[], Error>({
        queryKey: ['useFetchProvinces'],
        queryFn: async () => otherService.getProvinces(),
    });
};
