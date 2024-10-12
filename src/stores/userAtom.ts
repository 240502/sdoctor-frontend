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
