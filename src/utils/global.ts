export function showSuccess(input: any) {
    let parent = input.parentElement;
    let error__message = parent.querySelector('.error_message');
    parent.classList.remove('error');
    error__message.textContent = '';
}
export const handleFocusInput = (input: any) => {
    showSuccess(input);
};
export function showError(input: any, message: string) {
    let parent = input.parentElement;
    let error__message = parent.querySelector('.error_message');
    parent.classList.add('error');
    error__message.textContent = message;
}
export const isNumber = (char: any) => {
    let isNumber = false;
    if (!isNaN(parseInt(char))) {
        isNumber = true;
    }
    return isNumber;
};

export const isEmpty = (element: any) => {
    let isEmpty = false;
    if (!element.value) {
        showError(element, 'Không được để trống ô này');
        isEmpty = true;
    }

    return isEmpty;
};

export const isEmptyRadio = (element: any, value: any): boolean => {
    let isEmpty = false;
    if (value === undefined) {
        showError(element, 'Không được để trống ô này');
        isEmpty = true;
    }

    return isEmpty;
};
export const isEmptySelect = (element: any, value: any): boolean => {
    let isEmpty = false;
    if (value === 0) {
        showError(element.nativeElement, 'Không được để trống ô này');
        isEmpty = true;
    }

    return isEmpty;
};

export const isEmptyEditor = (element: any, value: any): boolean => {
    let isEmpty = false;
    if (value === '') {
        showError(element, 'Không được để trống ô này');
        isEmpty = true;
    }

    return isEmpty;
};
export const handleFocusSelect = (element: any) => {
    console.log(element);
    showSuccess(element.nativeElement);
};

export const validateName = (element: any) => {
    let isError = false;
    for (let i = 0; i < element.value.length; i++) {
        if (isNumber(element.value[i])) {
            showError(element, 'Tên bệnh nhân không bao gồm số');
            isError = true;
        }
    }
    return isError;
};

export const validateEmail = (element: any): boolean => {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isError = false;
    if (!emailRegex.test(element.value)) {
        showError(element, 'Email không hợp lệ');
        isError = true;
    }
    return isError;
};

export const validatePhone = (element: any): boolean => {
    let isError = false;
    for (let i = 0; i < element.value.length; i++) {
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
export const validatePhoneLength = (element: any): boolean => {
    let isError = false;

    if (element.value.length < 10 || element.value.length > 10) {
        isError = true;
        showError(element, 'Số điện thoại không hợp lệ');
    }
    return isError;
};
