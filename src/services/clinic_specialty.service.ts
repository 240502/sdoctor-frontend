import apiClient from '../constants/api';
import { ClinicSpecialty } from '../models/clinic_specialty';

const clinicSpecialtyService = {
    async createClinicSpecialty(data: ClinicSpecialty): Promise<any> {
        const res = await apiClient.post('/clinic-specialty/create', data);
        return res;
    },

    async updateClinicSpecialty(data: ClinicSpecialty): Promise<any> {
        const res = await apiClient.put('/clinic-specialty/update', data);
        return res;
    },

    async deleteClinicSpecialty(id: number): Promise<any> {
        const res = await apiClient.delete('/clinic-specialty/delete/' + id);
        return res;
    },

    async getClinicSpecialtyByClinicId(clinicId: number): Promise<any> {
        const res = await apiClient.get(
            '/clinic-specialty/get-clinic-specialty-by-clinicid/' + clinicId
        );
        return res;
    },
};
export default clinicSpecialtyService;
