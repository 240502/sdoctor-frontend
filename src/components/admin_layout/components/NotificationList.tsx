import { List, Dropdown, Badge, Button } from 'antd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    notificationsState,
    notificationsValue,
} from '../../../stores/notification';
import { useEffect } from 'react';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { NotificationService } from '../../../services/notificationService';
import { userValue } from '../../../stores/userAtom';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');
import { Notifications } from '../../../models/notification';
const NotificationList = () => {
    const user = useRecoilValue(userValue);
    const notificationSelector = useRecoilValue(notificationsValue);
    const setNotifications = useSetRecoilState(notificationsState);
    const deleteNotification = async (notificationId: number) => {
        try {
            const res = await NotificationService.deleteNotification(
                notificationId
            );
            const newNotifications = notificationSelector.notifications.filter(
                (notification: Notifications) =>
                    notification.id !== notificationId
            );
            setNotifications(newNotifications);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const markAllAsRead = async () => {
        try {
            const res = await NotificationService.markAllRead(user.userId);
            getNotificationByUserId();
        } catch (e: any) {
            console.log(e.message);
        }
    };
    const menu = (
        <>
            <div
                style={{ width: 300 }}
                className="bg-light shadow notification-list"
            >
                <List
                    header={
                        <div className="p-3">
                            <strong>Thông báo</strong>
                            <span
                                style={{
                                    float: 'right',
                                    cursor: 'pointer',
                                    color: '#1890ff',
                                }}
                                onClick={markAllAsRead}
                            >
                                Đánh dấu đã đọc
                            </span>
                        </div>
                    }
                    dataSource={notificationSelector.notifications}
                    renderItem={(item) => (
                        <List.Item
                            className={`${
                                item?.isRead === 0
                                    ? 'notification-unread'
                                    : 'notification-read'
                            } notification p-3`}
                        >
                            <div>
                                {item?.message}{' '}
                                <span className="d-block fw-normal text-secondary">
                                    {dayjs(
                                        new Date(
                                            item?.createdAt
                                                .toString()
                                                .split('Z')[0]
                                        )
                                    ).fromNow()}
                                </span>
                            </div>
                            <Button
                                className="delete-button border-0 bg-transparent"
                                onClick={() => {
                                    deleteNotification(item?.id);
                                }}
                            >
                                <CloseOutlined />
                            </Button>
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
    const getNotificationByUserId = async () => {
        try {
            const res = await NotificationService.getNotificationByUserId(
                user?.userId
            );

            setNotifications(res);
        } catch (err: any) {
            console.log(err.message);
            setNotifications([]);
        }
    };
    useEffect(() => {
        getNotificationByUserId();
    }, [user]);
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Badge count={notificationSelector?.notifications?.length}>
                <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationList;
