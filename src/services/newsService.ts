import { apiClient } from '../constants/api';

export const NewsService = {
    async getCommonNews(): Promise<any> {
        const res = await apiClient.get('/api/news/get-common-post');
        return res.data;
    },
};
