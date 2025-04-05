import { useMutation } from '@tanstack/react-query';
import { postService } from '../../services';

const useUpdatePostViews = () => {
    return useMutation({
        mutationFn: async (postId: number) => {
            return await postService.updateViewPost(postId);
        },
        onSuccess: (data: any) => {
            console.log('data updated successfully', data);
        },
    });
};

export default useUpdatePostViews;
