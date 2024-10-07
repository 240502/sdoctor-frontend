import { atom, selector } from 'recoil';
import { Doctor } from '../models/doctor';

export const doctorListState = atom({
    key: 'doctorListState',
    default: [] as Doctor[],
});

export const doctorListValue = selector({
    key: 'doctorListValue',
    get: ({ get }) => {
        return get(doctorListState);
    },
});
