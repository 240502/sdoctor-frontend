import { useQuery } from '@tanstack/react-query';
import { PostCategoryService } from '../../services';

export const useFetchAllPostCategories = () => {
    return useQuery({
        queryKey: ['useFetchAllPostCategories'],
        queryFn: PostCategoryService.getAllPostCategory,
        placeholderData: (previousData) => previousData ?? [],
    });
};
