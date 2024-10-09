import { showError } from './global';

export const validateDateBooking = (element: any): boolean => {
    let isError = false;
    const now = new Date();
    const dateBooking = new Date(element.value);

    if (
        dateBooking.getFullYear() > now.getFullYear() &&
        dateBooking.getMonth() > now.getMonth() &&
        dateBooking.getDate() > now.getDate()
    ) {
        showError(element, 'Ngày khám không hợp lệ');
        isError = true;
    }
    return isError;
};
