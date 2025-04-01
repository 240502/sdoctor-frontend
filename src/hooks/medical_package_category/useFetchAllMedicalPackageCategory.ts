import { useQuery } from '@tanstack/react-query';
import { serviceCategoryService } from '../../services';

export const useFetchAllMedicalPackageCategory = () => {
    return useQuery({
        queryKey: ['useFetchAllMedicalPackage'],
        queryFn: serviceCategoryService.getAll,
    });
};
