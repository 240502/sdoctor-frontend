import { apiClient, config } from '../constants/api';

export const NewsService = {
    async getCommonNews(): Promise<any> {
        const res = await apiClient.get('/api/news/get-common-post');
        return res.data;
    },
    async updateViewsNews(id: number): Promise<any> {
        const res = await apiClient.put('/api/post/update-views-post/' + id);
        return res;
    },
    async createNews(data: any): Promise<any> {
        const res = await apiClient.post('/api/post/create', data, config);
        return res.data;
    },
    async viewNewsAdmin(data: any): Promise<any> {
        const res = await apiClient.post(
            '/api/post/view-news-admin',
            data,
            config
        );
        return res.data;
    },
    async updateNews(data: any): Promise<any> {
        const res = await apiClient.put('/api/post/update', data, config);
        return res;
    },
    async deleteNews(id: number): Promise<any> {
        const res = await apiClient.delete('/api/post/delete/' + id, config);
        return res;
    },
};
