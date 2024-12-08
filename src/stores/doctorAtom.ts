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

export const homePageSearchContent = atom({
    key: 'homePageSearchContent',
    default: '',
});

export const doctorState = atom({
    key: 'doctorState',
    default: {} as Doctor,
});

export const doctorValue = selector({
    key: 'doctorValue',
    get: ({ get }) => {
        return get(doctorState);
    },
});
