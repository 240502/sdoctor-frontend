import { apiClient } from '../constants/api';

export const PostCategoryService = {
    async getAllPostCategory(): Promise<any> {
        const res = await apiClient.get(
            '/api/post-category/get-all-post-category'
        );
        return res.data;
    },
};
