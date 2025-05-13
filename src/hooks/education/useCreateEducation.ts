import { useMutation } from '@tanstack/react-query';
import educationService from '../../services/education.service';

export const useCreateEducation = () => {
    return useMutation({
        mutationKey: ['useCreateEducation'],
        mutationFn: (payload: any) => educationService.createEducation(payload),
    });
};
