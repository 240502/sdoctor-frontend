import { useMutation, useQuery } from '@tanstack/react-query';
import { UserUpdateDTO } from '../../models';
import { userService } from '../../services';

const useUpdateUser = () => {
    return useMutation({
        mutationFn: (user: UserUpdateDTO) => userService.updateUser(user),
    });
};

const useFetchUserById = (id: number | null) => {
    return useQuery({
        queryKey: ['useFetchUserById', id],
        queryFn: () => {
            if (!id) {
                throw new Error('Không có user id!');
            }
            return userService.getById(id);
        },
    });
};

export { useUpdateUser, useFetchUserById };
