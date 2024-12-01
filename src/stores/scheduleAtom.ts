import { atom, selector } from 'recoil';
import { Schedule } from '../models/schedule';

export const scheduleListState = atom({
    key: 'scheduleListState',
    default: [] as Schedule[],
});

export const scheduleListValue = selector({
    key: 'scheduleListValue',
    get: ({ get }) => {
        return get(scheduleListState);
    },
});
