import { List, Dropdown, Badge, Button, notification } from 'antd';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    notificationsState,
    notificationsValue,
} from '../../../../stores/notifiction';
import { useEffect, useState } from 'react';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { NotificationService } from '../../../../services/notificationService';
import { userValue } from '../../../../stores/userAtom';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');
import { Notifications } from '../../../../models/notification';
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
            const res = await NotificationService.markAllRead(user.user_id);
            getNotificationByUserId();
        } catch (e: any) {
            console.log(e.message);
        }
    };
    const menu = (
        <>
            {notificationSelector.notifications?.length > 0 ? (
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
                                    item?.is_read === 0
                                        ? 'notification-unread'
                                        : 'notification-read'
                                } notification p-3`}
                            >
                                <div>
                                    {item?.message}{' '}
                                    <span className="d-block fw-normal text-secondary">
                                        {dayjs(
                                            new Date(
                                                item.created_at
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
            ) : (
                <></>
            )}
        </>
    );
    const getNotificationByUserId = async () => {
        try {
            const res = await NotificationService.getNotificationByUserId(
                user?.user_id
            );

            setNotifications(res.data);
            //setUnreadCount(res.totalItems);
        } catch (err: any) {
            console.log(err.message);
            setNotifications([]);
            // setUnreadCount(0);
        }
    };
    useEffect(() => {
        getNotificationByUserId();
    }, []);
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Badge count={notificationSelector.total}>
                <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationList;
