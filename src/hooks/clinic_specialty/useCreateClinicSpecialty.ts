import { useMutation } from '@tanstack/react-query';
import clinicSpecialtyService from '../../services/clinic_specialty.service';
import { ClinicSpecialty } from '../../models';

export const useCreateClinicSpecialty = () => {
    return useMutation({
        mutationFn: (clinicSpecialty: ClinicSpecialty) =>
            clinicSpecialtyService.createClinicSpecialty(clinicSpecialty),
    });
};
