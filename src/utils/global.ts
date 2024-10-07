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

export const handleFocusSelect = (element: any) => {
    showSuccess(element.nativeElement);
};
