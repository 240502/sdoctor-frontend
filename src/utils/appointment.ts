export const isEmpty = (value: any) => {
    if (value !== '') return true;
    return false;
};
export const validatePatientName = (value: any) => {
    let isError = false;
    value.forEach((char: any) => {
        if (isNaN(Number(char))) isError = true;
    });
    return isError;
};

export const validateProvince = (value: any) => {
    let isError = false;
    if (value) return isError;
};
