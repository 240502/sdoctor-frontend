import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Menu } from 'antd';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const PatientProfileLayout = ({ children, breadcrumb }: any) => {
    const [currentKey, setCurrentKey] = useState<any>(['1']);
    const sectionTopRef = useRef<HTMLDivElement>(null);
    const mockData: any = [
        {
            key: '1',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
            link: '/patient/profile',
        },

        {
            key: '4',
            label: 'Lịch hẹn',
            icon: <i className="fa-regular fa-calendar-check"></i>,
            link: '/patient/appointment',
        },
    ];

    return (
        <div className="m-4 patient-profile-container" ref={sectionTopRef}>
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
                <div className="block__left col-2" style={{ height: '100vh' }}>
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
                <div className="block__right col-10">{children}</div>
            </div>
        </div>
    );
};
