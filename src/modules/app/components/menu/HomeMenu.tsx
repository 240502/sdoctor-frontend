import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export const HomeMenu = () => {
    const [current, setCurrent] = useState('');
    const currentMenuLocal = JSON.parse(
        localStorage.getItem('currentMenu') || ''
    );
    useEffect(() => {
        const getCurrentMenuLocal = async () => {
            if (currentMenuLocal === '') setCurrent('home');
            setCurrent(currentMenuLocal);
        };
        getCurrentMenuLocal();
    }, [currentMenuLocal]);
    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
        localStorage.setItem('currentMenu', JSON.stringify(e.key));
    };

    return (
        <Menu
            className="home__menu "
            mode="horizontal"
            onClick={handleChangeMenu}
            selectedKeys={[current]}
            style={{ maxHeight: '700px', zIndex: '99' }}
        >
            <Menu.Item
                key="home"
                className="home__menu__item text-decoration-none"
            >
                <Link to="/" className="text-decoration-none menu__item__text">
                    Trang chủ
                </Link>
            </Menu.Item>
            <Menu.Item
                key="doctor"
                className="home__menu__item text-decoration-none"
            >
                <Link
                    to="/doctor"
                    className="text-decoration-none  menu__item__text"
                >
                    Bác sĩ
                </Link>
            </Menu.Item>
            <Menu.Item
                key="clinic"
                className="home__menu__item text-decoration-none"
            >
                <Link
                    to="clinic"
                    className="text-decoration-none  menu__item__text"
                >
                    {' '}
                    Cơ sở y tế
                </Link>
            </Menu.Item>
            <Menu.Item key="service" className="home__menu__item ">
                {' '}
                <Link
                    to="service"
                    className="text-decoration-none  menu__item__text"
                >
                    Dịch vụ
                </Link>
            </Menu.Item>
            <Menu.Item
                key="news"
                className="home__menu__item text-decoration-none"
            >
                <Link
                    to="news"
                    className=" menu__item__text text-decoration-none"
                >
                    {' '}
                    Sống khỏe
                </Link>
            </Menu.Item>
        </Menu>
    );
};
