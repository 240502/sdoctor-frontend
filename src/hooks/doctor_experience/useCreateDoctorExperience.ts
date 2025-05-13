import { useMutation } from '@tanstack/react-query';
import { workExperienceService } from '../../services';

export const useCreateDoctorExperience = () => {
    return useMutation({
        mutationKey: ['useCreateDoctorExperience'],
        mutationFn: (payload: any) =>
            workExperienceService.createWorkExperience(payload),
    });
};
