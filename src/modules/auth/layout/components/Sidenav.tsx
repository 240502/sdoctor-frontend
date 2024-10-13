import { Menu } from 'antd';
import React from 'react';
import parse from 'html-react-parser';

import { Functions } from '../../../../models/functions';

export const Sidenav = ({ current, setCurrent, user }: any) => {
    const onClickMenu = (e: any) => {
        setCurrent(e.key);
        localStorage.setItem('menu_key', JSON.stringify(e.key));
    };
    return (
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
                        {parse(String(item.icon))}{' '}
                        <span className="ps-3 ms-3">{item.function_name}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
