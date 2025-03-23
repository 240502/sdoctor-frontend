import { apiClient } from '../constants/api';

const postCategoryService = {
    async getAllPostCategory(): Promise<any> {
        const res = await apiClient.get('/post-category/get-all-post-category');
        return res.data;
    },
};
export default postCategoryService;
