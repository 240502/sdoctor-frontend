import { nestApi } from '../constants/api';
export const PostService = {
    async getCommonPost(): Promise<any> {
        const res = await nestApi.get('/post/get-common');
        return res.data;
    },
    async updateViewPost(id: number): Promise<any> {
        const res = await nestApi.put('/post/update-views-post/' + id);
        return res;
    },
    async createPost(data: any, config: any): Promise<any> {
        const res = await nestApi.post('/post/create', data, config);
        return res.data;
    },

    async viewPost(data: any): Promise<any> {
        const res = await nestApi.post('/post/view', data);
        return res.data;
    },
    async getNewPost(): Promise<any> {
        const res = await nestApi.get('/post/get-new-posts');
        return res?.data;
    },
    async updatePost(data: any, config: any): Promise<any> {
        const res = await nestApi.put('/post/update', data, config);
        return res;
    },
    async deletePost(id: number, config: any): Promise<any> {
        const res = await nestApi.delete('/post/delete/' + id, config);
        return res;
    },
    async getPostById(id: number): Promise<any> {
        const res = await nestApi.get('/post/get-by-id/' + id);
        return res?.data;
    },
    async getRelatedPost(data: any): Promise<any> {
        const res = await nestApi.post('/post/get-related-post', data);
        return res?.data;
    },
    async confirmPost(id: number, config: any): Promise<any> {
        const res = await nestApi.put('/post/confirm/' + id, config);
        return res;
    },
};
