import { atom, selector } from 'recoil';
import { Post } from '../models/post';

export const postsState = atom({
    key: 'postsState',
    default: [] as Post[],
});

export const postsValue = selector({
    key: 'postsValue',
    get: ({ get }) => {
        return get(postsState);
    },
});
