import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { WardType } from '../../models';
import { otherService } from '../../services';

export const useFetchWardsByDistrict = (
    districtId: number | null
): UseQueryResult<WardType[], Error> => {
    return useQuery<WardType[], Error>({
        queryKey: ['useFetchProvinces', districtId],
        queryFn: async () => otherService.getWardsByDistrict(districtId),
    });
};
