import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { postService } from '../../services';
import { FetchPostPayload, PostResponse } from '../../models';

export const useFetchPostWithPagination = (
    payload: FetchPostPayload
): UseQueryResult<PostResponse, Error> => {
    return useQuery<PostResponse, Error>({
        queryKey: ['useFetchPostWithPagination', payload],
        queryFn: async () => postService.viewPost(payload),
    });
};
