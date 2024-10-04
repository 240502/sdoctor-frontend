import { atom } from 'recoil';
import { Doctor } from '../models/doctor';

export const doctorListState = atom({
    key: 'doctorListState',
    default: [] as Doctor[],
});
