import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { postService } from '../../services';
import { CreatePostResponse, PostCreateDto } from '../../models';

export const useCreatePost = (): UseMutationResult<
    CreatePostResponse,
    Error,
    PostCreateDto
> => {
    return useMutation<CreatePostResponse, Error, PostCreateDto>({
        mutationKey: ['useCreatePost'],
        mutationFn: async (newPost: PostCreateDto) =>
            postService.createPost(newPost),
        onSuccess(data) {
            console.log('created succesful', data);
        },
        onError(error: any) {
            if (error?.response?.status === 403) {
                throw new Error('Yêu cầu không hợp lệ, vui lòng thử lại!');
            }
            throw error;
        },
    });
};
