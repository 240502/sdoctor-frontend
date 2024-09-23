import React, { useState } from 'react';
import { Menu, Input } from 'antd';
import { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

export const HomeMenu = () => {
    const [current, setCurrent] = useState('home');
    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            className="home__menu"
            mode="horizontal"
            onClick={handleChangeMenu}
            selectedKeys={[current]}
            style={{ maxHeight: '700px' }}
        >
            <Menu.Item key="home" className="home__menu__item">
                <Link to="/">Trang chủ</Link>
            </Menu.Item>
            <Menu.Item key="doctor" className="home__menu__item">
                <Link to="/doctor">Bác sĩ</Link>
            </Menu.Item>
            <Menu.Item key="clinic" className="home__menu__item">
                <Link to="clinic"> Cơ sở y tế</Link>
            </Menu.Item>
            <Menu.Item key="service" className="home__menu__item">
                {' '}
                <Link to="service">Dịch vụ</Link>
            </Menu.Item>
            <Menu.Item key="news" className="home__menu__item">
                <Link to="news"> Sống khỏe</Link>
            </Menu.Item>
        </Menu>
    );
};
