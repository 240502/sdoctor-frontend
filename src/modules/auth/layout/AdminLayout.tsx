import React, { useEffect, useState } from 'react';

import { Layout, theme, message } from 'antd';
import { Link } from 'react-router-dom';

import { Sidenav } from './components/Sidenav';
import { HeaderLayout } from './components/Header';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { requestConfig, userValue } from '../../../stores/userAtom';
import socket from '../../../socket';
import { NotificationService } from '../../../services/notificationService';
import {
    notificationsState,
    notificationsValue,
} from '../../../stores/notifiction';
const { Sider, Content } = Layout;

const AdminLayout: React.FC = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState<string[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const user = useRecoilValue(userValue);
    const setRequestConfig = useSetRecoilState(requestConfig);
    const setNotifications = useSetRecoilState(notificationsState);
    const notificationsSelector = useRecoilValue(notificationsValue);
    useEffect(() => {
        const config = { headers: { authorization: 'Bearer ' + user.token } };
        setRequestConfig(config);
    }, [user]);
    useEffect(() => {
        socket.on('newNotification', (newNotification) => {
            messageApi.info('Có thông báo mới');
            console.log('newNotification', newNotification);
            const newNotifications = [
                ...notificationsSelector.notifications,
                newNotification,
            ];
            const sortedNotificationsAsc = newNotifications.sort(
                (a, b) => b.id - a.id
            );
            setNotifications(sortedNotificationsAsc);
        });

        return () => {
            socket.off('newNotification');
        };
    }, []);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="mb-3">
                    <h3 className="fs-3 fw-bold text-white p-3 text-center">
                        <Link
                            style={{ color: '#0d6efd' }}
                            to={'/'}
                            className="text-decoration-none "
                        >
                            SDOCTOR
                        </Link>
                    </h3>
                </div>
                <Sidenav
                    current={current}
                    // setCurrent={setCurrent}
                    // user={user}
                />
            </Sider>
            <Layout style={{ width: '200vh' }}>
                <HeaderLayout
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
