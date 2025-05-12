import { useMutation } from '@tanstack/react-query';
import { doctorExpertisesService } from '../../services';
import educationService from '../../services/education.service';

export const useCreateEducation = () => {
    useMutation({
        mutationKey: ['useCreateEducation'],
        mutationFn: (payload: any) => educationService.createEducation(payload),
    });
};
