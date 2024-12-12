import { apiClient } from '../constants/api';
export const PostService = {
    async getCommonPost(): Promise<any> {
        const res = await apiClient.get('/api/post/get-common-post');
        return res.data;
    },
    async updateViewPost(id: number): Promise<any> {
        const res = await apiClient.put('/api/post/update-views-post/' + id);
        return res;
    },
    async createPost(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/post/create', data, config);
        return res.data;
    },
    async viewPostAdmin(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            '/api/post/view-news-doctor',
            data,
            config
        );
        return res.data;
    },
    async viewPostClient(data: any): Promise<any> {
        const res = await apiClient.post('/api/post/view-news-client', data);
        return res.data;
    },
    async getNewPost(): Promise<any> {
        const res = await apiClient.get('/api/post/get-new-post');
        return res?.data;
    },
    async updatePost(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/api/post/update', data, config);
        return res;
    },
    async deletePost(id: number, config: any): Promise<any> {
        const res = await apiClient.delete('/api/post/delete/' + id, config);
        return res;
    },
    async getPostById(id: number): Promise<any> {
        const res = await apiClient.get('/api/post/get-by-id/' + id);
        return res?.data;
    },
    async getRelatedPost(data: any): Promise<any> {
        const res = await apiClient.post('/api/post/get-related', data);
        return res?.data;
    },
    async confirmPost(id: number, config: any): Promise<any> {
        const res = await apiClient.put('/api/post/confirm/' + id, config);
        return res;
    },
};
