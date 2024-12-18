import { apiClient } from '../constants/api';

export const ServiceService = {
    async createService(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/service/create', data, config);
        return res;
    },
    async deleteService(id: number, config: any): Promise<any> {
        const res = await apiClient.delete('/api/service/delete/' + id, config);
        return res;
    },
    async updateService(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/api/service/update/', data, config);
        return res;
    },
    async getServiceById(id: number): Promise<any> {
        const res = await apiClient.get('/api/service/get-by-id/' + id);
        return res?.data;
    },
    async viewService(data: any): Promise<any> {
        const res = await apiClient.post('/api/service/view', data);
        return res?.data;
    },
    async getCommonService(): Promise<any> {
        const res = await apiClient.get('/api/service/get-common-service');
        return res?.data;
    },
};
