import { List, Dropdown, Badge, Button, notification } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { notificationsState } from '../../../../stores/notifiction';
import { useEffect, useState } from 'react';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { NotificationService } from '../../../../services/notificationService';
import { userValue } from '../../../../stores/userAtom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc); // Kích hoạt plugin UTC
dayjs.extend(timezone); // Kích hoạt plugin timezone để làm việc với múi giờ
import { Notifications } from '../../../../models/notification';
const NotificationList = () => {
    const user = useRecoilValue(userValue);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] =
        useRecoilState(notificationsState);
    const calculateTimeAgo = (time: any) => {
        // Kiểm tra xem thời gian có hợp lệ không
        const notificationTime = dayjs(time); // Đảm bảo rằng time là một chuỗi hợp lệ hoặc đối tượng ngày
        if (!notificationTime.isValid()) {
            console.error('Thời gian không hợp lệ:', time);
            return 'Thời gian không hợp lệ';
        }

        // Lấy thời gian hiện tại ở múi giờ Việt Nam (Asia/Ho_Chi_Minh)
        const now = dayjs().tz('Asia/Ho_Chi_Minh');

        // Kiểm tra sự khác biệt giữa hai thời gian (theo phút)
        const diffInMinutes = notificationTime.diff(now, 'minute');
        console.log('Thời gian hiện tại:', now.format());
        console.log('Thời gian thông báo:', notificationTime.format());
        console.log('Sự khác biệt (phút):', diffInMinutes);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        }

        const diffInHours = notificationTime.diff(now, 'hour');
        if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        }

        const diffInDays = notificationTime.diff(now, 'day');
        if (diffInDays < 30) {
            return `${diffInDays} ngày trước`;
        }

        return notificationTime.format('DD/MM/YYYY');
    };
    const deleteNotification = async (notificationId: number) => {
        try {
            const res = await NotificationService.deleteNotification(
                notificationId
            );
            const newNotifications = notifications.filter(
                (notification: Notifications) =>
                    notification.id !== notificationId
            );
            setNotifications(newNotifications);
            setUnreadCount((unreadCount) => unreadCount - 1);
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
            {notifications?.length > 0 ? (
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
                        dataSource={notifications}
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
                                        {item?.timeAgo}
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
            let newNotifications = [];
            newNotifications = res.data.map((item: Notifications) => {
                console.log(item.created_at);
                const timeAgo = calculateTimeAgo(item.created_at);
                console.log(timeAgo);
                return { ...item, timeAgo: timeAgo };
            });
            console.log('New Notifications', newNotifications);
            setNotifications(newNotifications);
            setUnreadCount(res.totalItems);
        } catch (err: any) {
            console.log(err.message);
            setNotifications([]);
            setUnreadCount(0);
        }
    };
    useEffect(() => {
        getNotificationByUserId();
    }, []);
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Badge count={unreadCount}>
                <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationList;
