import { useQuery } from '@tanstack/react-query';
import { MedicalPackageService } from '../../services';

export const useFetchCommonMedicalPackages = () => {
    return useQuery({
        queryKey: ['useFetchCommonMedicalPackages'],
        queryFn: MedicalPackageService.getCommonService,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
