export const openNotification = (
    api: any,
    type: any,
    title: string,
    message: string
) => {
    api[type]({
        message: title,
        description: message,
    });
};
