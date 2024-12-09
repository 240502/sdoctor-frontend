import {
    Button,
    Image,
    theme,
    Dropdown,
    Divider,
    Row,
    Col,
    Flex,
    Menu,
    Badge,
    Avatar,
    List,
} from 'antd';
import type { MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    DownOutlined,
    UserOutlined,
} from '@ant-design/icons';
import '@/assets/scss/animation.scss';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, userValue } from '../../../../stores/userAtom';
import { User } from '../../../../models/user';

export const HeaderLayout = ({ collapsed, setCollapsed }: any) => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const user = useRecoilValue(userValue);
    const [isShowNotifi, setIsShowNotifi] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Thông báo 1', time: '2 phút trước', read: false },
        { id: 2, title: 'Thông báo 2', time: '10 phút trước', read: true },
    ]);
    const [unreadCount, setUnreadCount] = useState(1);
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };
    const notificationMenu = (
        <div
            style={{
                width: '300px', // Tăng chiều rộng
                maxHeight: '400px', // Tăng chiều cao, có cuộn nếu nội dung quá dài
                overflowY: 'auto',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#fff',
                borderRadius: '8px',
            }}
        >
            <div style={{ marginBottom: '8px', textAlign: 'right' }}>
                <Button type="link" onClick={markAllAsRead}>
                    Đánh dấu tất cả đã đọc
                </Button>
            </div>
            <List
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            fontWeight: item.read ? 'normal' : 'bold',
                            padding: '10px 12px', // Tăng kích thước padding
                            fontSize: '16px', // Tăng kích thước font
                        }}
                    >
                        {item.title}
                        <div style={{ fontSize: '12px', color: '#aaa' }}>
                            {item.time}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );

    const userMenu = (
        <Menu>
            <Menu.Item key="1">Hồ sơ</Menu.Item>
            <Menu.Item key="2">Đăng xuất</Menu.Item>
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
                <Dropdown
                    overlay={notificationMenu}
                    trigger={['click']}
                    placement="bottomLeft"
                >
                    <Badge count={unreadCount} offset={[5, 0]}>
                        <BellOutlined
                            style={{ fontSize: '24px', cursor: 'pointer' }}
                        />
                    </Badge>
                </Dropdown>

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
