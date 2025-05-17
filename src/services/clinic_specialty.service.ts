import apiClient from '../constants/api';
import { ClinicSpecialty } from '../models/clinic_specialty';

const clinicSpecialtyService = {
    async createClinicSpecialty(data: ClinicSpecialty): Promise<any> {
        const res = await apiClient.post('/clinic-specialty/create', data);
        return res;
    },
};
export default clinicSpecialtyService;
