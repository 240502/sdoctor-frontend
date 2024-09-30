import { apiClient } from '../constants/api';

export const ClinicService = {
    async getPopularClinic(): Promise<any> {
        const res: any = await apiClient.get('/api/clinic/get-popular-clinic');
        return res?.data;
    },
};
