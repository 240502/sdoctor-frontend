import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeMenuService } from '../../../../services/home_menuService';
import { HomeMenuModel } from '../../../../models/home_menu';

export const HomeMenu = () => {
    const [current, setCurrent] = useState('1');
    const [homeMenus, setHomeMenus] = useState<HomeMenuModel[]>();

    const loadData = async () => {
        try {
            const data = await HomeMenuService.getHomeMenu();
            setHomeMenus(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getCurrentMenuLocal = async (currentMenuLocal: any) => {
        setCurrent(currentMenuLocal);
    };
    useEffect(() => {
        const currentMenuLocal = JSON.parse(
            localStorage.getItem('currentMenu') || '1'
        );
        getCurrentMenuLocal(currentMenuLocal);
        loadData();
    }, []);

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
            {homeMenus?.map((homeMenu: HomeMenuModel) => {
                return (
                    <Menu.Item
                        key={Number(homeMenu.id)}
                        className="home__menu__item text-decoration-none"
                    >
                        <Link
                            to={homeMenu.url}
                            className="text-decoration-none menu__item__text"
                        >
                            {homeMenu.name}
                        </Link>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};
