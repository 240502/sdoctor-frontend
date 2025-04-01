import { useQuery } from '@tanstack/react-query';
import { medicalPackageService } from '../../services';

export const useFetchMedicalPackageByClinicId = (clinicId: number) => {
    return useQuery({
        queryKey: [
            'useFetchMedicalPackageByClinicId',
            JSON.stringify(clinicId),
        ],
        queryFn: async () =>
            medicalPackageService.getMedicalPackageByClinicId(clinicId),
        retry: 1,
    });
};
