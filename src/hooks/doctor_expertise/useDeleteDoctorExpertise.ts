import { useMutation } from '@tanstack/react-query';
import { doctorExpertisesService } from '../../services';

export const useDeleteDoctorExpertise = () => {
    return useMutation({
        mutationKey: ['useDeleteDoctorExpertise'],
        mutationFn: (id: number | null) =>
            doctorExpertisesService.deleteDoctorExpertise(id),
    });
};
