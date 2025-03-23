import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services';

export const useFetchNewPosts = () => {
    return useQuery({
        queryKey: ['useFetchNewPosts'],
        queryFn: async () => {
            return await postService.getNewPosts();
        },

        placeholderData: (previousData) => previousData ?? [],
    });
};
