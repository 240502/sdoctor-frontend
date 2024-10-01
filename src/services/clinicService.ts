import { apiClient } from '../constants/api';

export const ClinicService = {
    async getCommonClinic(): Promise<any> {
        const res: any = await apiClient.get('/api/clinic/get-common-clinic');
        return res?.data;
    },
};
