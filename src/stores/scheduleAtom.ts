import { atom, selector } from 'recoil';
import { DoctorSchedule } from '../models/doctorSchedule';

export const scheduleListState = atom({
    key: 'scheduleListState',
    default: [] as DoctorSchedule[],
});

export const scheduleListValue = selector({
    key: 'scheduleListValue',
    get: ({ get }) => {
        return get(scheduleListState);
    },
});
