import { atom, selector } from 'recoil';
import { Clinic, ClinicOptions } from '../models/clinic';
export const clinicListState = atom({
    key: 'clinicListState',
    default: [] as Clinic[],
});

export const clinicListValue = selector({
    key: 'clinicListValue',
    get: ({ get }) => {
        return get(clinicListState);
    },
});

export const allClinicsState = atom({
    key: 'allClinicsState',
    default: [] as Clinic[],
});

export const clinicFilterOptions = atom({
    key: 'clinicFilterOptions',
    default: {} as ClinicOptions,
});

export const clinicFilterOptionsValue = selector({
    key: 'clinicFilterOptionsValue',
    get: ({ get }) => get(clinicFilterOptions),
});
