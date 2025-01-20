import { apiClient, nestApi } from '../constants/api';

export const MajorService = {
    async getCommonMajor(): Promise<any> {
        const res: any = await nestApi.get('/major/get-common');
        return res?.data;
    },
    async getAllMajor(): Promise<any> {
        const res: any = await nestApi.get('/major/get-all');
        return res?.data;
    },
    async getMajorById(id: number): Promise<any> {
        const res: any = await nestApi.get('/major/get-by-id/' + id);
        return res?.data;
    },
    async viewMajor(data: any): Promise<any> {
        const res: any = await nestApi.post('/major/view', data);
        return res?.data;
    },
};
