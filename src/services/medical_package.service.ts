import { apiClient } from '../constants/api';

export const MedicalPackageService = {
    async createService(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/service/create', data, config);
        return res;
    },
    async deleteService(id: number, config: any): Promise<any> {
        const res = await apiClient.delete('/service/delete/' + id, config);
        return res;
    },
    async updateService(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/service/update/', data, config);
        return res;
    },
    async getServiceById(id: number): Promise<any> {
        const res = await apiClient.get('/service/get-by-id/' + id);
        return res?.data;
    },
    async viewService(data: any): Promise<any> {
        const res = await apiClient.post('/service/view', data);
        return res?.data;
    },
    async getCommonService(): Promise<any> {
        const res = await apiClient.get('/service/get-common-service');
        return res?.data;
    },
    async updateView(id: any): Promise<any> {
        const res = await apiClient.put('/service/update-views/' + id);
        return res;
    },
};
