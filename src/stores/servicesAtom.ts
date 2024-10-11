import { atom, selector } from 'recoil';
import { Services } from '../models/services';

export const serviceListState = atom({
    key: 'serviceListState',
    default: [] as Services[],
});
export const serviceListValue = selector({
    key: 'serviceListValue',
    get: ({ get }) => {
        return get(serviceListState);
    },
});
