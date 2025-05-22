import apiClient from '../constants/api';
import {
    MedicalEquipment,
    MedicalEquipmentCreateDto,
    MedicalEquipmentUpdateDto,
} from '../models/medical_equipment';

const medicalEquipmentService = {
    async createMedicalEquipment(
        data: MedicalEquipmentCreateDto
    ): Promise<any> {
        const res = await apiClient.post('/medical-equipment/create', data);
        return res;
    },

    async updateMedicalEquipment(data: MedicalEquipmentUpdateDto): Promise<any> {
        const res = await apiClient.put('/medical-equipment/update', data);
        return res;
    },
    async deleteMedicalEquipment(id: number | null): Promise<any> {
        const res = await apiClient.delete('/medical-equipment/delete/' + id);
        return res;
    },

    async getMedicalEquipmentByClinicId(clinicId: number | null): Promise<any> {
        const res = await apiClient.get(
            '/medical-equipment/get-medical-equipment-by-clinicid/' + clinicId
        );
        return res?.data;
    },
};
export default medicalEquipmentService;
