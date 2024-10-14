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
    async updateViewsClinic(id: number): Promise<any> {
        const res: any = await apiClient.put(
            '/api/clinic/update-views-clinic/' + id
        );
        return res;
    },
    async getClinicById(id: number): Promise<any> {
        const res = await apiClient.get('/api/clinic//getById/' + id);
        return res.data;
    },
};
