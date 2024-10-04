export const validatePatientName = (value: any) => {
    let isError = false;
    value.forEach((char: any) => {
        if (isNaN(Number(char))) isError = true;
    });
    return isError;
};
