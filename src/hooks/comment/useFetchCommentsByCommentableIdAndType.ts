import {
    UseQueryResult,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    InfiniteData,
} from '@tanstack/react-query';
import { Comment } from '../../models';
import { commentService } from '../../services';
// Định nghĩa interface cho response của lastPage
interface PaginatedComments {
    comments: Comment[];
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    totalItems: number;
}
export const useFetchCommentsByCommentableIdAndType = (
    payload: any
): UseInfiniteQueryResult<InfiniteData<PaginatedComments>, Error> => {
    return useInfiniteQuery<PaginatedComments, Error>({
        // Chỉ khai báo type dữ liệu trực tiếp
        queryKey: ['useFetchRelatedPost', JSON.stringify(payload)],
        queryFn: async ({ pageParam = 1 }) => {
            return commentService.getCommentByCommentableIdAndType({
                ...payload,
                pageIndex: pageParam,
            });
        },

        initialPageParam: 1,
        retry: 1,
        getNextPageParam: (lastPage) => {
            const { pageIndex, pageCount } = lastPage;
            return pageIndex < pageCount ? pageIndex + 1 : undefined;
        },
    });
};
