import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { otherService } from '../../services';
import { DistrictType } from '../../models';

export const useFetchDistrictsByProvince = (
    provinceId: number | null
): UseQueryResult<DistrictType[], Error> => {
    return useQuery<DistrictType[], Error>({
        queryKey: ['useFetchDistrictByProvince', provinceId],
        queryFn: () => otherService.getDistrictByProvince(provinceId),
    });
};
