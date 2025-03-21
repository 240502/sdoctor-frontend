import { useQuery } from '@tanstack/react-query';
import { PostService } from '../../services';

export const useFetchNewPosts = () => {
    return useQuery({
        queryKey: ['useFetchNewPosts'],
        queryFn: async () => {
            return await PostService.getNewPosts();
        },
        
        placeholderData: (previousData) => previousData ?? [],
    });
};
