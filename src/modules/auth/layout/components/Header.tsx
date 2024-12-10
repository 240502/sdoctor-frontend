import { Button, theme, Dropdown, Menu, Avatar } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import '@/assets/scss/animation.scss';
import { User } from '../../../../models/user';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, userValue } from '../../../../stores/userAtom';
import { notificationsValue } from '../../../../stores/notification';
import { Notifications } from '../../../../models/notification';
import NotificationList from './NotificationList';
export const HeaderLayout = ({ collapsed, setCollapsed }: any) => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const user = useRecoilValue(userValue);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const userMenu = (
        <Menu>
            <Menu.Item key="1">Hồ sơ</Menu.Item>
            <Menu.Item
                key="2"
                onClick={() => {
                    setUser({} as User);
                    sessionStorage.removeItem('user');
                    navigate('/');
                }}
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 16px',
                background: colorBgContainer,
            }}
        >
            <div style={{ fontSize: '18px', color: '#fff' }}>
                {' '}
                <Button
                    type="text"
                    icon={
                        collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginRight: '16px',
                }}
            >
                {/* Bell Icon */}
                {<NotificationList />}
                {/* User Info */}
                <Dropdown overlay={userMenu} trigger={['click']}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#000',
                        }}
                    >
                        <Avatar icon={<UserOutlined />} />
                        <span style={{ marginLeft: '8px' }}>
                            {user.full_name}
                        </span>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};
