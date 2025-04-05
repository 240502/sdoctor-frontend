import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { postService } from '../../services';
import { Post } from '../../models';
// Định nghĩa interface cho response của lastPage
interface PaginatedPosts {
    posts: Post[];
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    totalItems: number;
}
export const useFetchRelatedPosts = (
    payload: any
): UseQueryResult<PaginatedPosts, Error> => {
    // return useInfiniteQuery<PaginatedPosts, Error>({
    //     // Chỉ khai báo type dữ liệu trực tiếp
    //     queryKey: ['useFetchRelatedPost', JSON.stringify(payload)],
    //     queryFn: async ({ pageParam = 1 }) => {
    //         return postService.getRelatedPost({
    //             ...payload,
    //             pageIndex: pageParam,
    //         });
    //     },

    //     initialPageParam: 1,
    //     retry: 1,
    //     getNextPageParam: (lastPage) => {
    //         const { pageIndex, pageCount } = lastPage;
    //         return pageIndex < pageCount ? pageIndex + 1 : undefined;
    //     },
    // });

    return useQuery<PaginatedPosts, Error>({
        queryKey: ['useFetchRelatedPosts', JSON.stringify(payload)],
        queryFn: () => postService.getRelatedPost(payload),
        retry: 1,
        select: (response: PaginatedPosts) => {
            return {
                posts: response.posts,
                pageIndex: response.pageIndex,
                pageCount: response.pageCount,
                pageSize: response.pageSize,
                totalItems: response.totalItems,
            };
        },
    });
};
