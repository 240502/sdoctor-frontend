import { MessageInstance, NoticeType } from 'antd/es/message/interface';

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

export const openMessage = (
    api: MessageInstance,
    type: NoticeType,
    content: string
) => {
    api.open({ type, content });
};
