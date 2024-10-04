export function showSuccess(input: any) {
    let parent = input.parentElement;
    let error__message = parent.querySelector('.error_message');
    parent.classList.remove('error');
    error__message.textContent = '';
}

export function showError(input: any, message: string) {
    let parent = input.parentElement;
    let error__message = parent.querySelector('.error_message');
    parent.classList.add('error');
    error__message.textContent = message;
}
export const isNumber = (char: any) => {
    return !isNaN(parseInt(char));
};

export const isEmpty = (element: any) => {
    let isEmpty = false;

    if (!element.value) {
        showError(element, 'Không được để trống ô này');
        isEmpty = true;
    }

    return isEmpty;
};
