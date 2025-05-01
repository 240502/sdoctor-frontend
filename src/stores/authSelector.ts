import { selector } from 'recoil';
import { userService } from '../services';
import {
    accessTokenState,
    refreshTokenState,
    isAuthenticatedState,
} from './userAtom';

export const authSelector = selector({
    key: 'authSelector',
    get: async ({ get }) => {
        const accessToken = get(accessTokenState);
        const refreshToken = get(refreshTokenState);
        const isAuthenticated = get(isAuthenticatedState);

        if (!accessToken && refreshToken) {
            try {
                const newTokens = await userService.refreshToken(refreshToken);
                return {
                    accessToken: newTokens.accessToken,
                    refreshToken,
                    isAuthenticated: true,
                };
            } catch (error) {
                return {
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                };
            }
        }

        return { accessToken, refreshToken, isAuthenticated };
    },
    set: ({ set }, newValue: any) => {
        set(accessTokenState, newValue.accessToken);
        set(refreshTokenState, newValue.refreshToken);
        set(isAuthenticatedState, newValue.isAuthenticated);

        if (newValue.accessToken) {
            localStorage.setItem('accessToken', newValue.accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }

        if (newValue.refreshToken) {
            localStorage.setItem('refreshToken', newValue.refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    },
});
