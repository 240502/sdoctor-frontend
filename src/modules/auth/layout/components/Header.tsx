import { Button, Image, theme, Dropdown, Space, Divider } from 'antd';
import type { MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BellOutlined,
    DownOutlined,
} from '@ant-design/icons';
import '@/assets/scss/animation.scss';

import React, { useState } from 'react';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <Button style={{ width: '100%' }} className="border-0">
                Hồ sơ
            </Button>
        ),
    },
    {
        type: 'divider',
    },
    {
        key: '2',
        label: (
            <Button
                style={{ width: '100%' }}
                type="primary"
                danger
                className="border-0"
            >
                Đăng xuất
            </Button>
        ),
    },
];
export const HeaderLayout = ({ collapsed, setCollapsed }: any) => {
    const [isShowNotifi, setIsShowNotifi] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="container">
                {' '}
                <div className="d-flex align-items-center justify-content-between">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div className="position-relative d-flex justify-content-center align-items-center">
                        <div className="notification col-4 text-center position-relative">
                            <Button
                                className="border-0 fs-5 p-2"
                                onClick={() => {
                                    console.log('oge');
                                    setIsShowNotifi(!isShowNotifi);
                                }}
                            >
                                <BellOutlined />
                            </Button>
                            <ul
                                className="notification__list position-absolute bg-primary start-0 end-0 top-100"
                                style={{
                                    display: `${
                                        isShowNotifi ? 'block' : 'none'
                                    }`,
                                    animation: 'showNotification 0.5s linear',
                                }}
                            >
                                <li className="item">Thông báo 1</li>
                                <Divider className="m-1" />
                                <li className="item">Thông báo 2</li>
                                <Divider className="m-1" />

                                <li className="item"> Thông báo 3</li>
                            </ul>
                        </div>
                        <Dropdown
                            menu={{ items }}
                            className="avatar justify-content-center align-items-center col-6 d-flex"
                        >
                            <div className="text-center">
                                <Image
                                    preview={false}
                                    style={{
                                        width: '50%',
                                        cursor: 'pointer',
                                    }}
                                    className="rounded-circle col-2"
                                    src="https://cdn.bookingcare.vn/fo/w384/2023/09/04/170853-benh-mo-mau-cao.jpg"
                                />
                                <div className="col-7">
                                    <h6 className="user__name ">
                                        Nguyễn Văn Sang
                                    </h6>
                                    <p className="p-0 m-0 lh-base">Bác sĩ</p>
                                </div>

                                <DownOutlined />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Header>
    );
};
