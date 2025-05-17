import { useMutation } from '@tanstack/react-query';
import { MedicalEquipmentCreateDto } from '../../models';
import medicalEquipmentService from '../../services/medical_equipment.service';

export const useCreateMedicalEquipment = () => {
    return useMutation({
        mutationFn: (medicalEquipment: MedicalEquipmentCreateDto) =>
            medicalEquipmentService.createMedicalEquipment(medicalEquipment),
    });
};
