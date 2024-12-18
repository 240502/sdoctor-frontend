import { atom, selector } from 'recoil';
import { Invoices } from '../models/invoices';

export const invoiceState = atom({
    key: 'invoiceState',
    default: {} as Invoices,
});

export const invoiceValue = selector({
    key: 'invoiceValue',
    get: ({ get }) => {
        return get(invoiceState);
    },
});
