import { useMutation, useQuery } from '@tanstack/react-query';
import { MedicalEquipment, MedicalEquipmentCreateDto } from '../../models';
import medicalEquipmentService from '../../services/medical_equipment.service';

export const useCreateMedicalEquipment = () => {
    return useMutation({
        mutationFn: (medicalEquipment: MedicalEquipmentCreateDto) =>
            medicalEquipmentService.createMedicalEquipment(medicalEquipment),
    });
};

export const useDeleteMedicalEquipment = () => {
    return useMutation({
        mutationFn: (id: number) =>
            medicalEquipmentService.deleteMedicalEquipment(id),
    });
};

export const useUpdateMedicalEquipment = () => {
    return useMutation({
        mutationFn: (medicalEquipment: MedicalEquipment) =>
            medicalEquipmentService.updateMedicalEquipment(medicalEquipment),
    });
};

export const useGetMedicalEquipmentByClinicId = (clinicId: number) => {
    return useQuery({
        queryKey: ['useGetMedicalEquipmentByClinicId', clinicId],
        queryFn: () =>
            medicalEquipmentService.getMedicalEquipmentByClinicId(clinicId),
    });
};
