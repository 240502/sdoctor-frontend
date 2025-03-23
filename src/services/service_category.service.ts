import { apiClient } from '../constants/api';

const serviceCategoryService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/service-category/get-all');
        return res.data;
    },
};
export default serviceCategoryService;
