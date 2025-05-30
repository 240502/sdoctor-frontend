import { Button, theme, Dropdown, Menu, Avatar, Divider } from 'antd';
import { Header as HeaderLayout } from 'antd/es/layout/layout';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import '@/assets/scss/animation.scss';
import { User } from '../../../models/user';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, userValue } from '../../../stores/userAtom';
import NotificationList from './NotificationList';
import { Link } from 'react-router-dom';
import { useLogout } from '../../../hooks/user';
const Header = ({ collapsed, setCollapsed }: any) => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const user = useRecoilValue(userValue);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { mutate: Logout } = useLogout();
    const userMenu = (
        <Menu className="">
            <Menu.Item key="1">
                <Link
                    to={
                        user?.roleId === 2
                            ? `/admin/doctor-profile/${user.userId}`
                            : `/admin/profile?user=${user.userId}}`
                    }
                    className="text-decoration-none text-dark"
                >
                    Hồ sơ
                </Link>
            </Menu.Item>
            <Divider className="mt-1 mb-1"></Divider>
            <Menu.Item key="2">
                <Link
                    to="/admin/profile"
                    className="text-decoration-none text-dark"
                >
                    Đổi mật khẩu
                </Link>
            </Menu.Item>
            <Divider className="mt-1 mb-1"></Divider>

            <Menu.Item
                key="3"
                className="bg-danger text-light"
                onClick={() => {
                    setUser({} as User);
                    localStorage.removeItem('user');
                    navigate('/');
                    Logout();
                }}
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <HeaderLayout
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
                {<NotificationList />}
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
                            {user?.fullName ?? ''}
                        </span>
                    </div>
                </Dropdown>
            </div>
        </HeaderLayout>
    );
};

export default Header;
