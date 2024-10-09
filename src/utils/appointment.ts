import { showError } from './global';

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
