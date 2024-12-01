import React, { useEffect, useState } from 'react';

import { Button, Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

import { Sidenav } from './components/Sidenav';
import { HeaderLayout } from './components/Header';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { requestConfig, userValue } from '../../../stores/userAtom';
const { Sider, Content } = Layout;

const AdminLayout: React.FC = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState<string[]>([]);
    const user = useRecoilValue(userValue);
    const setRequestConfig = useSetRecoilState(requestConfig);
    useEffect(() => {
        const config = { headers: { authorization: 'Bearer ' + user.token } };
        setRequestConfig(config);
    }, [user]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
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
