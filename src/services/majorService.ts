import { apiClient } from '../constants/api';

export const MajorService = {
    async getCommonMajor(): Promise<any> {
        const res: any = await apiClient.get('/api/major/get-common-major');
        return res?.data;
    },
};
