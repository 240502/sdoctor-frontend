import { useMutation } from '@tanstack/react-query';
import { userService } from '../../services';

export const useLogout = () => {
    return useMutation({
        mutationKey: ['useLogout'],
        mutationFn: () => userService.logout(),
    });
};
