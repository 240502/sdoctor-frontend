import { apiClient } from '../constants/api';

export const ClinicService = {
    async getCommonClinic(): Promise<any> {
        const res: any = await apiClient.get('/api/clinic/get-common-clinic');
        return res?.data;
    },
    async viewClinic(data: any): Promise<any> {
        const res: any = await apiClient.post('/api/clinic/view', data);
        return res?.data;
    },
};
