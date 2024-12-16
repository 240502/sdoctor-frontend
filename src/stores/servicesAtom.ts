import { atom, selector } from 'recoil';
import { Service } from '../models/service';

export const serviceListState = atom({
    key: 'serviceListState',
    default: [] as Service[],
});
export const serviceListValue = selector({
    key: 'serviceListValue',
    get: ({ get }) => {
        return get(serviceListState);
    },
});
