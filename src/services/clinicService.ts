import { nestApi } from '../constants/api';

export const ClinicService = {
    async getCommonClinic(): Promise<any> {
        const res: any = await nestApi.get('/clinic/get-common');
        return res?.data;
    },
    async viewClinic(data: any): Promise<any> {
        const res: any = await nestApi.post('/clinic/view', data);
        return res?.data;
    },
    async updateViewsClinic(id: number): Promise<any> {
        const res: any = await nestApi.put('/clinic/update-views/' + id);
        return res;
    },
    async getClinicById(id: number): Promise<any> {
        const res = await nestApi.get('/clinic/get-by-id/' + id);
        return res.data;
    },
    async createClinic(data: any, config: any): Promise<any> {
        const res = await nestApi.post('/clinic/create', data, config);
        return res;
    },
    async updateClinic(data: any, config: any): Promise<any> {
        const res = await nestApi.put('/clinic/update', data, config);
        return res;
    },
    async deleteClinic(id: number, config: any): Promise<any> {
        const res = await nestApi.delete('/clinic/delete/' + id, config);
        return res;
    },
};
