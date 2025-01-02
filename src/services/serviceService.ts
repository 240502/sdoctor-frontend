import { apiClient, nestApi } from '../constants/api';

export const ServiceService = {
    async createService(data: any, config: any): Promise<any> {
        const res = await nestApi.post('/service/create', data, config);
        return res;
    },
    async deleteService(id: number, config: any): Promise<any> {
        const res = await nestApi.delete('/service/delete/' + id, config);
        return res;
    },
    async updateService(data: any, config: any): Promise<any> {
        const res = await nestApi.put('/service/update/', data, config);
        return res;
    },
    async getServiceById(id: number): Promise<any> {
        const res = await nestApi.get('/service/get-by-id/' + id);
        return res?.data;
    },
    async viewService(data: any): Promise<any> {
        const res = await nestApi.post('/service/view', data);
        return res?.data;
    },
    async getCommonService(): Promise<any> {
        const res = await nestApi.get('/service/get-common');
        return res?.data;
    },
    async updateView(id: any): Promise<any> {
        const res = await nestApi.put('/service/update-view/' + id);
        return res;
    },
};
