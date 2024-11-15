import React, { useEffect, useState } from 'react';
import { Button, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { HomeMenuService } from '../../../../../services/home_menuService';
import { HomeMenuModel } from '../../../../../models/home_menu';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, userValue } from '../../../../../stores/userAtom';

export const HomeMenu = () => {
    const navigate = useNavigate();
    const [homeMenus, setHomeMenus] = useState<HomeMenuModel[]>();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [user, setUser] = useRecoilState(userState);
    const loadData = async () => {
        try {
            const data = await HomeMenuService.getHomeMenu();
            setHomeMenus(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getUser = async () => {
        try {
            const user: any = await JSON.parse(
                sessionStorage.getItem('user') || 'null'
            );
            if (user) {
                setUser(user);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        loadData();
        getUser();
        console.log(user.id);
    }, []);

    return (
        <Menu
            className="home__menu border-0 col-8  justify-content-center"
            mode="horizontal"
            selectedKeys={selectedKeys}
            style={{ maxHeight: '700px', zIndex: '99' }}
        >
            {homeMenus?.map((homeMenu: HomeMenuModel, index: number) => {
                return (
                    <Menu.Item
                        key={Number(homeMenu.id)}
                        className="home__menu__item text-decoration-none"
                    >
                        <Link
                            key={index}
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
