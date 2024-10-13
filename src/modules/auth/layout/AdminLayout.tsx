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
import parse from 'html-react-parser';

import { Functions } from '../../../models/functions';
import { Sidenav } from './components/Sidenav';
import { HeaderLayout } from './components/Header';
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
                <Sidenav
                    current={current}
                    setCurrent={setCurrent}
                    user={user}
                />
            </Sider>
            <Layout>
                <HeaderLayout />
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
