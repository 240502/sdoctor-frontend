import { apiClient } from '../constants/api';

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
};
