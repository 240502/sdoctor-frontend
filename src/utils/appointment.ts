import { isNumber, showError } from './global';

export const validatePatientName = (element: any) => {
    let isError = false;
    for (let i = 0; i < element.value.length; i++) {
        if (isNumber(element.value[i])) {
            showError(element, 'Tên bệnh nhân không bao gồm số');
            isError = true;
        }
    }
    return isError;
};

export const validatePatientEmail = (element: any): boolean => {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isError = false;
    if (!emailRegex.test(element.value)) {
        showError(element, 'Email không hợp lệ');
        isError = true;
    }
    return isError;
};
export const validatePatientPhone = (element: any): boolean => {
    let isError = false;
    for (let i = 0; i < element.length; i++) {
        if (!isNumber(element.value[i])) {
            showError(
                element,
                'Số điện thoại không bao gồm kí tự đặt biệt hay kí tự chữ'
            );
            isError = true;
        }
    }

    return isError;
};

export const validatePatientBirthDay = (element: any): boolean => {
    let isError = false;
    const now = new Date();
    const patientBirthday = new Date(element.value);
    console.log(
        patientBirthday.getFullYear() >= now.getFullYear() &&
            patientBirthday.getMonth() >= now.getMonth() &&
            patientBirthday.getDate() >= now.getDate()
    );
    if (
        patientBirthday.getFullYear() >= now.getFullYear() &&
        patientBirthday.getMonth() >= now.getMonth() &&
        patientBirthday.getDate() >= now.getDate()
    ) {
        showError(element, 'Ngày sinh không hợp lệ');
        isError = true;
    }
    return isError;
};
