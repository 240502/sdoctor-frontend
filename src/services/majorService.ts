import { apiClient } from '../constants/api';

export const MajorService = {
    async getPopularMajor(): Promise<any> {
        const res: any = await apiClient.get('/api/major/get-popular-major');
        return res?.data;
    },
};
