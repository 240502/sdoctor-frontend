import { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeMenuService } from '../../../../../services/home_menuService';
import { HomeMenuModel } from '../../../../../models/home_menu';
import { useSetRecoilState } from 'recoil';
import { majorIdState } from '../../../../../stores/majorAtom';

export const HomeMenu = () => {
    const setMajorId = useSetRecoilState(majorIdState);
    const [homeMenus, setHomeMenus] = useState<HomeMenuModel[]>();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const loadData = async () => {
        try {
            const data = await HomeMenuService.getHomeMenu();
            setHomeMenus(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        loadData();
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
                        onClick={() => setMajorId(0)}
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
