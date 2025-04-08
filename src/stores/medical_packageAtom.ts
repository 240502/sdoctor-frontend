import { atom, selector } from 'recoil';
import {
    MedicalPackage,
    MedicalPackageOptions,
} from '../models/medical_package';

export const serviceListState = atom({
    key: 'serviceListState',
    default: [] as MedicalPackage[],
});
export const serviceListValue = selector({
    key: 'serviceListValue',
    get: ({ get }) => {
        return get(serviceListState);
    },
});

export const medicalPackageOptionsState = atom({
    key: 'medicalPackageOptionsState',
    default: {} as MedicalPackageOptions,
});

export const medicalPackageOptionsValue = selector({
    key: 'medicalPackageValue',
    get: ({ get }) => {
        return get(medicalPackageOptionsState);
    },
});
