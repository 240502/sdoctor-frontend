import { atom } from 'recoil';
import { Appointment } from '../models/appointment';

export const appointmentListState = atom({
    key: 'appointmentListState',
    default: [] as Appointment[],
});
