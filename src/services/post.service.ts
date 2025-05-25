import { AxiosResponse } from 'axios';
import apiClient from '../constants/api';
import { FetchPostPayload, PostResponse } from '../models';
const postService = {
    async getCommonPost(): Promise<any> {
        const res = await apiClient.get('/post/get-common-post');
        return res.data;
    },
    async updateViewPost(id: number): Promise<any> {
        const res = await apiClient.put('/post/update-views-post/' + id);
        return res;
    },
    async createPost(data: any): Promise<any> {
        const res = await apiClient.post('/post/create', data);
        return res.data;
    },

    async viewPost(payload: FetchPostPayload): Promise<PostResponse> {
        const res: AxiosResponse<PostResponse> = await apiClient.get(
            `/post/get-post-with-options?position=${payload.position}&searchContent=${payload.searchContent}&categoryId=${payload.categoryId}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&status=${payload.status}&authorId=${payload.authorId}`
        );
        return res.data;
    },
    async getNewPosts(): Promise<any> {
        const res = await apiClient.get('/post/get-new-posts');
        return res?.data;
    },
    async updatePost(data: any): Promise<any> {
        const res = await apiClient.put('/post/update', data);
        return res;
    },
    async deletePost(id: number): Promise<any> {
        const res = await apiClient.delete('/post/delete/' + id);
        return res;
    },
    async getPostById(id: number): Promise<any> {
        const res = await apiClient.get('/post/get-by-id/' + id);
        return res?.data;
    },
    async getRelatedPost(data: any): Promise<any> {
        const res = await apiClient.post('/post/get-related-post', data);
        return res?.data;
    },
    async confirmPost(id: number): Promise<any> {
        const res = await apiClient.put('/post/confirm/' + id);
        return res;
    },
};
export default postService;
