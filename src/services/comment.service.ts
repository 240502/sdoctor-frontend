import { apiClient } from '../constants/api';
const commentService = {
    async createComment(data: any): Promise<any> {
        const res = await apiClient.post('/comment/create', data);
        return res;
    },
    async getCommentByUserId(data: any): Promise<any> {
        const res = await apiClient.post(
            '/comment/get-comment-by-doctor-id',
            data
        );
        return res?.data;
    },
};
export default commentService;
