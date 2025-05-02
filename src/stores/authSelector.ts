import { selector } from 'recoil';
import { userService } from '../services';
import { isAuthenticatedState } from './userAtom';

export const authSelector = selector({
    key: 'authSelector',
    get: async ({ get }) => {
        const isAuthenticated = get(isAuthenticatedState);

        return { isAuthenticated };
    },
    set: ({ set }, newValue: any) => {
        set(isAuthenticatedState, newValue.isAuthenticated);
    },
});
