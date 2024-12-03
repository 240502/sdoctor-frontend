import { apiClient } from '../constants/api';

export const MajorService = {
    async getCommonMajor(): Promise<any> {
        const res: any = await apiClient.get('/api/major/get-common-major');
        return res?.data;
    },
    async getAllMajor(): Promise<any> {
        const res: any = await apiClient.get('/api/major/get-all-major');
        return res?.data;
    },
    async getMajorById(id: number): Promise<any> {
        const res: any = await apiClient.get('/api/major/get-by-id/' + id);
        return res?.data;
    },
    async viewMajor(data: any): Promise<any> {
        const res: any = await apiClient.post('/api/major/view', data);
        return res?.data;
    },
};
