import { Button, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

export const HeaderLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Header
            style={{ padding: 0, background: colorBgContainer }}
            className="d-flex algin-items-center"
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div>
                <h3>group user</h3>
            </div>
        </Header>
    );
};
