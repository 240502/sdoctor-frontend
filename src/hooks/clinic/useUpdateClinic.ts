import { useMutation } from '@tanstack/react-query';
import { clinicService } from '../../services';
import { ClinicUpdateDto } from '../../models';

export const useUpdateClinic = () => {
    return useMutation({
        mutationKey: ['useUpdateClinic'],
        mutationFn: (clinic: ClinicUpdateDto) =>
            clinicService.updateClinic(clinic),
    });
};
