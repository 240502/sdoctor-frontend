import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { medicalPackageService } from '../../services';
import {
    MedicalPackage,
    MedicalPackageCreateDTO,
    MedicalPackageUpdateDTO,
} from '../../models';
export const useFetchMedicalPackageById = (
    id: number | null
): UseQueryResult<MedicalPackage, Error> => {
    return useQuery({
        queryKey: ['useFetchMedicalPackageById', JSON.stringify(id)],
        queryFn: () => {
            if (!id) {
                throw new Error('id is null');
            }
            return medicalPackageService.getMedicalPackageById(id);
        },
        retry: false,
    });
};

export const useCreateMedicalPackage = () => {
    return useMutation({
        mutationKey: ['useCreateMedicalPackage'],
        mutationFn: (medicalPackage: MedicalPackageCreateDTO) =>
            medicalPackageService.createService(medicalPackage),
    });
};

export const useUpdateMedicalPackage = () => {
    return useMutation({
        mutationKey: ['useUpdateMedicalPackage'],
        mutationFn: (medicalPackage: MedicalPackageUpdateDTO) =>
            medicalPackageService.updateService(medicalPackage),
    });
};
