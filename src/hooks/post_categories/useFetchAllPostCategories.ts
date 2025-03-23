import { useQuery } from '@tanstack/react-query';
import { postCategoryService } from '../../services';

export const useFetchAllPostCategories = () => {
    return useQuery({
        queryKey: ['useFetchAllPostCategories'],
        queryFn: postCategoryService.getAllPostCategory,
        placeholderData: (previousData) => previousData ?? [],
    });
};
