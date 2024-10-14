import { apiClient } from '../constants/api';

export const NewsService = {
    async getCommonNews(): Promise<any> {
        const res = await apiClient.get('/api/news/get-common-post');
        return res.data;
    },
    async updateViewsNews(id: number): Promise<any> {
        const res = await apiClient.put('/api/post/update-views-post/' + id);
        return res;
    },
};
