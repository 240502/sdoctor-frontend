import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../../../../stores/userAtom';
import { Functions } from '../../../../models/functions';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('0');

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const onClickMenu = (e: any) => {
        setCurrent(e.key);
        localStorage.setItem('menu_key', JSON.stringify(e.key));
    };
    useEffect(() => {
        const menuKey = JSON.parse(localStorage.getItem('menu_key') || '0');
        setCurrent(menuKey);
    }, []);
    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="mb-3">
                    <h3 className="fs-3 fw-bold text-white p-3 text-center">
                        <Link
                            to={'/'}
                            className="text-decoration-none text-white"
                        >
                            SDOCTOR
                        </Link>
                    </h3>
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[current]}
                    onClick={(e) => onClickMenu(e)}
                    mode="inline"
                    defaultSelectedKeys={['0']}
                >
                    {user?.functions.map((item: Functions, index: number) => {
                        return (
                            <Menu.Item key={index}>
                                {item.function_name}
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
