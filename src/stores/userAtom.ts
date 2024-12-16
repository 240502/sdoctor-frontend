import { atom, selector } from 'recoil';
import { User } from '../models/user';

export const userState = atom({
    key: 'userState',
    default: {} as User,
});

export const userValue = selector({
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
