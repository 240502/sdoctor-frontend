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

export const commonDoctorsState = atom({
    key: 'commonDoctorState',
    default: [] as Doctor[],
});
export const commonDoctorValue = selector({
    key: 'commonDoctorValue',
    get: ({ get }) => {
        return get(commonDoctorsState);
    },
});

export const doctorPagination = atom({
    key: 'doctorPagination',
    default: {
        pageCount: 0,
        pageIndex: 1,
        pageSize: 8,
        totalItems: 0,
    },
});

export const isPreventCallApi = atom({
    key: 'isPreventCallApi',
    default: false,
});

export const doctorOptions = atom({
    key: 'doctorOptions',
    default: {
        majorId: 0,
        clinicId: 0,
        name: '',
    },
});
