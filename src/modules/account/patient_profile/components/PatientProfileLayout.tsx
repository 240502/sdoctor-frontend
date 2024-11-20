import {
    HomeOutlined,
    UserOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Divider, Input, Menu } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';
import { Link } from 'react-router-dom';

export const PatientProfileLayout = ({ children, breadcrumb }: any) => {
    const [currentKey, setCurrentKey] = useState<any>(['1']);
    const patientProfile = useRecoilValue(patientProfileValue);

    const mockData: any = [
        {
            key: '1',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
            link: '/patient/profile',
        },

        {
            key: '2',
            label: 'Bác sĩ đã xem',
            icon: <i className="fa-solid fa-user-doctor"></i>,
            link: '/patient/watched-doctor',
        },

        {
            key: '3',
            label: 'Cơ sở y tế đã xem',
            icon: <i className="fa-regular fa-hospital"></i>,
            link: '/patient/watched-clinic',
        },

        {
            key: '4',
            label: 'Gói khám đã xem',
            icon: <SolutionOutlined />,
            link: '/patient/watched-service',
        },

        {
            key: '5',
            label: 'Lịch hẹn',
            icon: <i className="fa-regular fa-calendar-check"></i>,
            link: '/patient/appointment',
        },
    ];

    return (
        <div className="container mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },

                    {
                        title: breadcrumb,
                    },
                ]}
            />
            <div className="row mt-3">
                <div className="block__left col-3" style={{ height: '100vh' }}>
                    <Menu
                        style={{ height: '100vh' }}
                        mode="inline"
                        selectedKeys={[]}
                        onClick={(e) => {
                            setCurrentKey([e.key]);
                            localStorage.setItem(
                                'currentKey',
                                JSON.stringify([e.key])
                            );
                        }}
                    >
                        {mockData.map((item: any) => {
                            return (
                                <>
                                    <Menu.Item key={item?.key}>
                                        <Link
                                            className="text-decoration-none"
                                            to={item.link}
                                            key={item?.key}
                                        >
                                            {item?.label}
                                        </Link>
                                    </Menu.Item>
                                    <Divider className="m-0" />
                                </>
                            );
                        })}
                    </Menu>
                </div>
                <div className="block__right col-9">{children}</div>
            </div>
        </div>
    );
};
