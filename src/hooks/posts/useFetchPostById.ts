import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { postService } from '../../services';
import { Post } from '../../models';

export const useFetchPostById = (id: number): UseQueryResult<Post, Error> => {
    return useQuery({
        queryKey: ['useFetchPostById', JSON.stringify(id)],
        queryFn: () => postService.getPostById(id),
        retry: 1,
    });
};
