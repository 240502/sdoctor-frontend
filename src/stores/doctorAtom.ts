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

export const searchDoctorOptionsGlobal = atom({
    key: 'searchDoctorOptionsGlobal',
    default: { name: null, majorId: null } as any,
});
export const searchDoctorOptionsGlobalValue = selector({
    key: 'searchDoctorOptionsGlobalValue',
    get: ({ get }) => {
        return get(searchDoctorOptionsGlobal);
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
