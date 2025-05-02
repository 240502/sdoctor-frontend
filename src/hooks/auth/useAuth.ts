import { useMutation, useQuery } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userService } from '../../services';
import { User, LoginResponse, RefreshTokenResponse } from '../../models';
import { isAuthenticatedState, userState } from '../../stores/userAtom';
import { authSelector } from '../../stores/authSelector';
export const useLogin = () => {
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    const setUser = useSetRecoilState(userState);
    return useMutation<
        LoginResponse,
        Error,
        { email: string; password: string }
    >({
        mutationKey: ['login'],
        mutationFn: ({ email, password }) =>
            userService.login({ email, password }),
        onSuccess: (data) => {
            setIsAuthenticated(true);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        },
        onError: (err: any) => {
            if (err.response?.status == 403) {
                throw new Error('Yêu cầu không hợp lệ, vui lòng thử lại!');
            }
            throw err;
        },
        retry: 1,
    });
};

export const useRefreshToken = () => {
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    return useMutation<RefreshTokenResponse, Error, string>({
        mutationKey: ['refreshToken'],
        mutationFn: () => userService.refreshToken(),
        onSuccess: (data) => {
            setIsAuthenticated(true);
        },
        onError: () => {
            setIsAuthenticated(false);
        },
        retry: 1,
    });
};

// export const useProtectedData = () => {
//     const { accessToken } = useRecoilValue(authSelector);
//     const { mutate: refresh } = useRefreshToken();

//     return useQuery<User, Error>({
//         queryKey: ['protectedData'],
//         queryFn: () => getProtectedData(accessToken!),
//         enabled: !!accessToken,
//         retry: 1,
//         onError: () => {
//             if (accessToken) {
//                 refresh(accessToken);
//             }
//         },
//     });
// };

export const useAuth = () => {
    const authState = useRecoilValue(authSelector);
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    const logout = () => {
        setIsAuthenticated(false);
    };
    return {
        isAuthenticated: authState.isAuthenticated,
        logout,
    };
};
