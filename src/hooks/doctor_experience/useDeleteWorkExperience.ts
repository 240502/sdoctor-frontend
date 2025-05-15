import { useMutation } from '@tanstack/react-query';
import { workExperienceService } from '../../services';

export const useDeleteWorkExperience = () => {
    return useMutation({
        mutationKey: ['useDeleteWorkExperience'],
        mutationFn: (id: number) =>
            workExperienceService.deleteWorkExperience(id),
    });
};
