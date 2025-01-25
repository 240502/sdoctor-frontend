import { atom } from 'recoil';

export const paginationState = atom({
    key: 'paginationState',
    default: {
        pageIndex: 1,
        pageSize: 8,
        totalItems: 0,
        pageCount: 0,
    },
});
