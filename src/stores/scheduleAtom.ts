import { atom, selector } from 'recoil';
import { DoctorSchedule } from '../models/doctorSchedule';
import { PostCategory } from '../models/post_category';

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

export const postCategoryState = atom({
    key: 'postCategoryState',
    default: {} as PostCategory,
});
export const postCategoryValue = selector({
    key: 'postCategoryValue',
    get: ({ get }) => {
        return get(postCategoryState);
    },
});
