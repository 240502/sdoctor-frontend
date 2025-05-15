import { useMutation } from '@tanstack/react-query';
import { WorkExperienceUpdateDto } from '../../models';
import { workExperienceService } from '../../services';

export const useUpdateWorkExperience = () => {
    return useMutation({
        mutationKey: ['useUpdateWorkExperience'],
        mutationFn: (payload: WorkExperienceUpdateDto) =>
            workExperienceService.updateWorkExperience(payload),
    });
};
