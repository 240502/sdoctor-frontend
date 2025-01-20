import { nestApi } from '../constants/api';

export const PostCategoryService = {
    async getAllPostCategory(): Promise<any> {
        const res = await nestApi.get('/post-category/get-all');
        return res.data;
    },
};
