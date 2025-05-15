import { useMutation } from '@tanstack/react-query';
import educationService from '../../services/education.service';
import { EducationUpdateDto } from '../../models';

export const useUpdateEducation = () => {
    return useMutation({
        mutationKey: ['useUpdateEducation'],
        mutationFn: (payload: EducationUpdateDto) =>
            educationService.updateEducation(payload),
    });
};
