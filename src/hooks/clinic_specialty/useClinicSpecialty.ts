import { useMutation, useQuery } from '@tanstack/react-query';
import clinicSpecialtyService from '../../services/clinic_specialty.service';
import { ClinicSpecialty, ClinicSpecialtyCreateDto } from '../../models';

export const useCreateClinicSpecialty = () => {
    return useMutation({
        mutationFn: (clinicSpecialty: ClinicSpecialtyCreateDto) =>
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
export const useGetClinicSpecialtyByClinicId = (clinicId?: number | null) => {
    return useQuery({
        queryKey: ['useGetClinicSpecialtyByClinicId', clinicId],
        queryFn: () => {
            if (!clinicId) {
                throw new Error('clinicId is required');
            }
            return clinicSpecialtyService.getClinicSpecialtyByClinicId(
                clinicId
            );
        },
        enabled: !!clinicId,
        retry: false,
    });
};
