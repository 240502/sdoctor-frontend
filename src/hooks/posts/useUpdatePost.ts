import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { postService } from '../../services';
import { CreatePostResponse, PostUpdateDto } from '../../models';

export const useUpdatePost = (): UseMutationResult<
    CreatePostResponse,
    Error,
    PostUpdateDto
> => {
    return useMutation<CreatePostResponse, Error, PostUpdateDto>({
        mutationKey: ['useUpdatePost'],
        mutationFn: async (newPost: PostUpdateDto) =>
            postService.updatePost(newPost),
        onSuccess(data) {
            console.log('updated successful', data);
        },
        onError(error: any) {
            if (error?.response?.status === 403) {
                throw new Error('Yêu cầu không hợp lệ, vui lòng thử lại!');
            }
            throw error;
        },
    });
};
