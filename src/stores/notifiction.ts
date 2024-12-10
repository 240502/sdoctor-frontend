import { atom, selector } from 'recoil';
import { Notifications } from '../models/notification';
export const notificationsState = atom({
    key: 'notificationsState',
    default: [] as Notifications[],
});

export const notificationsValue = selector({
    key: 'notificationsValue',
    get: ({ get }) => {
        return get(notificationsState);
    },
});
