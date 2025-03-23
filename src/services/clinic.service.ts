import { apiClient } from '../constants/api';

const clinicService = {
    async getCommonClinic(): Promise<any> {
        const res: any = await apiClient.get('/clinic/get-common-clinic');
        return res?.data;
    },
    async viewClinic(data: any): Promise<any> {
        console.log(data);
        const res: any = await apiClient.post('/clinic/view', data);
        return res?.data;
    },
    async updateViewsClinic(id: number): Promise<any> {
        const res: any = await apiClient.put('/clinic/update-views/' + id);
        return res;
    },
    async getClinicById(id: number): Promise<any> {
        const res = await apiClient.get('/clinic/get-by-id/' + id);
        return res.data;
    },
    async createClinic(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/clinic/create', data, config);
        return res;
    },
    async updateClinic(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/clinic/update', data, config);
        return res;
    },
    async deleteClinic(id: number, config: any): Promise<any> {
        const res = await apiClient.delete('/clinic/delete/' + id, config);
        return res;
    },
};
export default clinicService;
