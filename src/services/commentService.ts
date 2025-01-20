import { nestApi } from '../constants/api';
export const CommentService = {
    async createComment(data: any): Promise<any> {
        const res = await nestApi.post('/comment/create', data);
        return res;
    },
    async getCommentByUserId(data: any): Promise<any> {
        const res = await nestApi.post(
            '/comment/get-comment-by-doctor-id',
            data
        );
        return res?.data;
    },
};
