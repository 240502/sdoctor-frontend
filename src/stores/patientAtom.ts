import { atom, selector } from 'recoil';
import { PatientProfile } from '../models/patient_profile';

export const patientProfileState = atom({
    key: 'patientProfile',
    default: {} as PatientProfile,
});

export const patientProfileValue = selector({
    key: 'patientProfileValue',
    get: ({ get }) => {
        return get(patientProfileState);
    },
});
