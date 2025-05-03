import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { postService } from '../../services';
import { CreatePostResponse } from '../../models';

export const useDeletePost = (): UseMutationResult<
    CreatePostResponse,
    Error,
    number
> => {
    return useMutation<CreatePostResponse, Error, number>({
        mutationKey: ['useDeletePost'],
        mutationFn: async (id: number) => postService.deletePost(id),
        onSuccess(data) {
            console.log('deleted successful', data);
        },
        onError(error: any) {
            if (error?.response?.status === 403) {
                throw new Error('Yêu cầu không hợp lệ, vui lòng thử lại!');
            }
            throw error;
        },
    });
};
