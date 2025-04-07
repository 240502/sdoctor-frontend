import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { medicalPackageService } from '../../services';
import { MedicalPackage } from '../../models';
export const useFetchMedicalPackageById = (
    id: number
): UseQueryResult<MedicalPackage, Error> => {
    return useQuery({
        queryKey: ['useFetchMedicalPackageById', JSON.stringify(id)],
        queryFn: () => medicalPackageService.getMedicalPackageById(id),
        retry: 1,
    });
};
