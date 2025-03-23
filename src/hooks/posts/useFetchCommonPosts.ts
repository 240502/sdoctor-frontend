import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services';

export const useFetchCommonPosts = () => {
    return useQuery({
        queryKey: ['useFetchCommonPosts'],
        queryFn: postService.getCommonPost,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
