import { useMutation } from '@tanstack/react-query';
import { doctorExpertisesService } from '../../services';

export const useUpdateDoctorExpertise = () => {
    return useMutation({
        mutationKey: ['useDoctorExpertise'],
        mutationFn: (payload: any) =>
            doctorExpertisesService.updateDoctorExpertise(payload),
    });
};
