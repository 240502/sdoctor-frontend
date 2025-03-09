import { atom } from 'recoil';

export const paginationAtom = atom({
    key: 'paginationAtom',
    default: {
        pageCount: 0,
    },
});
