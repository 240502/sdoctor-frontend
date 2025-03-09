import { atom, selector } from 'recoil';
import { Major } from '../models/major';

export const majorIdState = atom({ key: 'majorIdState', default: 0 });

export const majorIdValue = selector({
    key: 'majorIdValue',
    get: ({ get }) => {
        return get(majorIdState);
    },
});
export const allMajorsState = atom({
    key: 'allMajorsState',
    default: [] as Major[],
});
