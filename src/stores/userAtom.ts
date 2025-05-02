import { atom, selector } from 'recoil';
import { User } from '../models/user';

export const userState = atom<User>({
    key: 'userState',
    default: {} as User,
});

export const userValue = selector<User>({
    key: 'userValue',
    get: ({ get }) => {
        return get(userState);
    },
});

export const requestConfig = atom({
    key: 'requestConfig',
    default: {},
});
export const configValue = selector({
    key: 'config',
    get: ({ get }) => {
        return get(requestConfig);
    },
});

export const isAuthenticatedState = atom<boolean>({
    key: 'isAuthenticatedState',
    default: false,
});

export const authLoadingState = atom({
    key: 'authLoadingState',
    default: true, // Bắt đầu ở trạng thái đang tải
});
