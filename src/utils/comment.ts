import { showError } from './global';

export const validateDateBooking = (element: any, value: any): boolean => {
    let isError = false;
    const now = new Date();
    const dateBooking = new Date(value);
    console.log(dateBooking.getMonth());
    if (dateBooking.getFullYear() > now.getFullYear()) {
        isError = true;
    }
    if (dateBooking.getMonth() > now.getMonth()) {
        isError = true;
    }
    if (dateBooking.getDate() > now.getDate()) {
        isError = true;
    }
    if (isError) {
        showError(element, 'Ngày khám không hợp lệ');
    }
    return isError;
};
export const isEmptyDatePicker = (element: any, value: any): boolean => {
    let isEmpty = false;
    if (!value) {
        isEmpty = true;
        showError(element, 'Không được để trống ô này');
    }
    return isEmpty;
};
