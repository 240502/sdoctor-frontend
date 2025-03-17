import { apiClient } from '../constants/api';

export const DoctorServiceService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/api/doctor-service/get-all');
        return res?.data;
    },
};
