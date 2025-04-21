import React, { useEffect, useState } from 'react';

import { Layout, theme, message } from 'antd';
import { Link } from 'react-router-dom';

import { Sidenav } from './components/Sidenav';
import Header from './components/Header';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { requestConfig, userState } from '../../stores/userAtom';
import {
    notificationsState,
    notificationsValue,
} from '../../stores/notification';
import socket from '../../socket';
import { User } from '../../models/user';

const { Sider, Content } = Layout;

const AdminLayout: React.FC = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState<string[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useRecoilState(userState);
    const setRequestConfig = useSetRecoilState(requestConfig);
    const setNotifications = useSetRecoilState(notificationsState);
    const notificationsSelector = useRecoilValue(notificationsValue);
    const handleWindowLoad = (user: User) => {
        if (user?.userId) {
            socket?.emit('joinRoom', { userId: user.userId });
        }
    };
    const getUser = async () => {
        try {
            const userSession = await JSON.parse(
                sessionStorage.getItem('user') || '{}'
            );
            if (userSession?.userId) {
                setUser(userSession);
                const config = {
                    headers: { authorization: 'Bearer ' + userSession.token },
                };
                setRequestConfig(config);
                handleWindowLoad(userSession);
            }
        } catch (e: any) {
            console.error(e.message);
        }
    };
    useEffect(() => {
        if (!user?.userId) {
            getUser();
        }
        socket?.on('newNotification', (newNotification) => {
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
            socket?.off('newNotification');
        };
    }, []);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="mb-3 text-wrap">
                    <h3
                        className="fs-3 fw-bold text-white p-3 text-center text-wrap"
                        style={{ overflow: 'hidden' }}
                    >
                        <Link
                            style={{ color: '#0d6efd' }}
                            to={'/'}
                            className="text-decoration-none d-inline-block w-100 "
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
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
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
