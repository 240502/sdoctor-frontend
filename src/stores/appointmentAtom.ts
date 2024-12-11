import { atom, selector } from 'recoil';
import { Appointment } from '../models/appointment';

export const appointmentListState = atom({
    key: 'appointmentListState',
    default: [] as Appointment[],
});

export const appointmentListInDayState = atom({
    key: 'appointmentListInDayState',
    default: [] as Appointment[],
});
export const appointmentListInDayValue = selector({
    key: 'appointmentListInDayValue',
    get: ({ get }) => {
        return get(appointmentListInDayState);
    },
});

export const newAppointmentState = atom({
    key: 'newAppointmentState',
    default: {} as Appointment,
});

export const newAppointmentValue = selector({
    key: 'newAppointmentValue',
    get: ({ get }) => {
        return get(newAppointmentState);
    },
});
