import { useMutation } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useUpdateClinicViews = () => {
    return useMutation({
        mutationFn: async (clinicId: number) => {
            return await clinicService.updateViewsClinic(clinicId);
        },
        onSuccess: (data: any) => {
            console.log('data updated successfully', data);
        },
        onError: (error: any) => {
            console.log('error updating views', error);
        },
    });
};
