import React, { useState } from 'react';
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
export const MenuHeader = () => {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <Menu mode="horizontal" onClick={onClick} selectedKeys={[current]}>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
            <Menu.Item>DashBoard</Menu.Item>
        </Menu>
    );
};
