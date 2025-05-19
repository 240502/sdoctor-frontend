import { useMutation, useQuery } from '@tanstack/react-query';
import clinicSpecialtyService from '../../services/clinic_specialty.service';
import { ClinicSpecialty } from '../../models';

export const useCreateClinicSpecialty = () => {
    return useMutation({
        mutationFn: (clinicSpecialty: ClinicSpecialty) =>
            clinicSpecialtyService.createClinicSpecialty(clinicSpecialty),
    });
};

export const useUpdateClinicSpecialty = () => {
    return useMutation({
        mutationFn: (clinicSpecialty: ClinicSpecialty) =>
            clinicSpecialtyService.updateClinicSpecialty(clinicSpecialty),
    });
};

export const useDeleteClinicSpecialty = () => {
    return useMutation({
        mutationFn: (id: number) =>
            clinicSpecialtyService.deleteClinicSpecialty(id),
    });
};

export const useGetClinicSpecialtyByClinicId = (clinicId: number) => {
    return useQuery({
        queryKey: ['useGetClinicSpecialtyByClinicId', clinicId],
        queryFn: () =>
            clinicSpecialtyService.getClinicSpecialtyByClinicId(clinicId),
    });
};
