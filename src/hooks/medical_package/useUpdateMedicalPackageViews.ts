import { useMutation } from '@tanstack/react-query';
import { medicalPackageService } from '../../services';

export const useUpdateMedicalPackageViews = () => {
    return useMutation({
        mutationFn: async (medicalPackageId: number) => {
            return await medicalPackageService.updateView(medicalPackageId);
        },
        onSuccess: (data: any) => {
            console.log('update medical package views successfully', data);
        },
    });
};
