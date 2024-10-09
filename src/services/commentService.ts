import { apiClient } from '../constants/api';
import { Comment } from '../models/comment';
export const CommentService = {
    async createCommentForUser(data: Comment): Promise<any> {
        const res = await apiClient.post('/api/comment/create-for-user', data);
        return res;
    },
    async createCommentForPatient(data: Comment): Promise<any> {
        const res = await apiClient.post(
            '/api/comment/create-for-patient',
            data
        );
        return res;
    },
    async getCommentByUserId(data: any): Promise<any> {
        const res = await apiClient.post('/api/comment/get-by-user-id', data);
        return res?.data;
    },
};
