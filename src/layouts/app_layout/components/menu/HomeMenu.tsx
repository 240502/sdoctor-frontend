import { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { homeMenuService } from '../../../../services';
import { HomeMenuModel } from '../../../../models/home_menu';
import { useSetRecoilState } from 'recoil';
import { majorIdState } from '../../../../stores/majorAtom';
import type { MenuProps } from 'antd';
export const HomeMenu = () => {
    const setMajorId = useSetRecoilState(majorIdState);
    const [homeMenus, setHomeMenus] = useState<HomeMenuModel[]>([]);
    const loadData = async () => {
        try {
            const data = await homeMenuService.getHomeMenu();
            setHomeMenus(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    const menuItems: MenuProps['items'] = homeMenus.map((homeMenu) => ({
        key: homeMenu.id.toString(), // Chuyển id thành string cho key
        label: (
            <Link
                to={homeMenu.url}
                className="text-decoration-none menu__item__text"
                onClick={() => setMajorId(0)} // Gọi setMajorId khi click
            >
                {homeMenu.name}
            </Link>
        ),
        className: 'home__menu__item', // Áp dụng class cho menu item
    }));

    return (
        <Menu
            className="home__menu border-0 col-8  justify-content-center"
            mode="horizontal"
            selectedKeys={[]}
            style={{ maxHeight: '700px', zIndex: '99' }}
            items={menuItems}
        />
    );
};
