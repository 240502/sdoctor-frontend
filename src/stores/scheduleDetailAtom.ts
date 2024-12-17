import { atom, selector } from 'recoil';
import { DoctorScheduleDetail } from '../models/doctorScheduleDetails';

export const scheduleDetailsState = atom({
    key: 'scheduleDetailsState',
    default: [] as DoctorScheduleDetail[],
});

export const scheduleDetailsValue = selector({
    key: 'scheduleDetailsValue',
    get: ({ get }) => {
        return get(scheduleDetailsState);
    },
});
