import apiClient from '../constants/api';

const clinicService = {
    async getCommonClinic(): Promise<any> {
        const res: any = await apiClient.get('/clinic/get-common-clinic');
        return res?.data;
    },
    async viewClinic(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/clinic/get-clinic-with-pagination&options',
            data
        );
        return res?.data;
    },
    async updateViewsClinic(id: number): Promise<any> {
        const res: any = await apiClient.put('/clinic/update-views/' + id);
        return res;
    },
    async getClinicById(id: number | null): Promise<any> {
        const res = await apiClient.get('/clinic/get-by-id/' + id);
        return res.data;
    },
    async createClinic(data: any): Promise<any> {
        const res = await apiClient.post('/clinic/create', data);
        return res?.data;
    },
    async updateClinic(data: any): Promise<any> {
        const res = await apiClient.put('/clinic/update', data);
        return res;
    },
    async deleteClinic(id: number): Promise<any> {
        const res = await apiClient.delete('/clinic/delete/' + id);
        return res;
    },
};
export default clinicService;
