import { useMutation, useQuery } from '@tanstack/react-query';
import { MedicalEquipment, MedicalEquipmentCreateDto, MedicalEquipmentUpdateDto } from '../../models';
import medicalEquipmentService from '../../services/medical_equipment.service';

export const useCreateMedicalEquipment = () => {
    return useMutation({
        mutationFn: (medicalEquipment: MedicalEquipmentCreateDto) =>
            medicalEquipmentService.createMedicalEquipment(medicalEquipment),
    });
};

export const useDeleteMedicalEquipment = () => {
    return useMutation({
        mutationFn: (id: number | null) =>
            medicalEquipmentService.deleteMedicalEquipment(id),
    });
};

export const useUpdateMedicalEquipment = () => {
    return useMutation({
        mutationFn: (medicalEquipment: MedicalEquipmentUpdateDto) =>
            medicalEquipmentService.updateMedicalEquipment(medicalEquipment),
    });
};

export const useGetMedicalEquipmentByClinicId = (clinicId: number | null) => {
    return useQuery({
        queryKey: ['useGetMedicalEquipmentByClinicId', clinicId],
        queryFn: () =>
            medicalEquipmentService.getMedicalEquipmentByClinicId(clinicId),
    });
};
