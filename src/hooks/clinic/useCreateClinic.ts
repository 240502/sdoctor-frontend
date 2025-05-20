import { useMutation } from '@tanstack/react-query';
import { clinicService } from '../../services';
import { ClinicCreate } from '../../models';

export const useCreateClinic = () => {
    return useMutation({
        mutationKey: ['useCreateClinic'],
        mutationFn: (clinic: ClinicCreate) =>
            clinicService.createClinic(clinic),
    });
};
