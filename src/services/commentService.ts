import { apiClient } from '../constants/api';
import { Comment } from '../models/comment';
export const CommentService = {
    async createComment(data: any): Promise<any> {
        const res = await apiClient.post('/api/comment/create', data);
        return res;
    },
    async getCommentByUserId(data: any): Promise<any> {
        const res = await apiClient.post('/api/comment/get-by-user-id', data);
        return res?.data;
    },
};
