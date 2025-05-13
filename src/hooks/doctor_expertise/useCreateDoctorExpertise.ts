import { useMutation } from '@tanstack/react-query';
import { doctorExpertisesService } from '../../services';

export const useCreateDoctorExpertise = () => {
    return useMutation({
        mutationKey: ['useCreateDoctorExpertise'],
        mutationFn: (payload: any) =>
            doctorExpertisesService.createDoctorExpertises(payload),
    });
};
