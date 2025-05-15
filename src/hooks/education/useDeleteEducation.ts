import { useMutation } from '@tanstack/react-query';
import educationService from '../../services/education.service';

export const useDeleteEducation = () => {
    return useMutation({
        mutationKey: ['useDeleteEducation'],
        mutationFn: (id: number) => educationService.deleteEducation(id),
    });
};
