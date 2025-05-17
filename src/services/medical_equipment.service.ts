import apiClient from '../constants/api';
import { MedicalEquipmentCreateDto } from '../models/medical_equipment';

const medicalEquipmentService = {
    async createMedicalEquipment(
        data: MedicalEquipmentCreateDto
    ): Promise<any> {
        const res = await apiClient.post('/medical-equipment/create', data);
        return res;
    },
};
export default medicalEquipmentService;
