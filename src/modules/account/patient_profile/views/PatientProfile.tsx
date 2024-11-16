import {
    HomeOutlined,
    UserOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Input, Menu } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { ViewProfile } from '../components/ViewProfile';
import { ViewWatchedDoctor } from '../components/ViewWatchedDoctor';
import { ViewWatchedClinic } from '../components/ViewWatchedClinic';
import { ViewWatchedService } from '../components/ViewWatchedService';
import { ViewAppintment } from '../components/ViewAppintment';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';

type MenuItem = Required<MenuProps>['items'][number];
const PatientProfile = () => {
    const [currentKey, setCurrentKey] = useState(['1']);
    const patientProfile = useRecoilValue(patientProfileValue);

    const items: MenuItem[] = [
        {
            key: '1',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
        },
        { type: 'divider' },
        {
            key: '2',
            label: 'Bác sĩ đã xem',
            icon: <i className="fa-solid fa-user-doctor"></i>,
        },
        { type: 'divider' },
        {
            key: '3',
            label: 'Cơ sở y tế đã xem',
            icon: <i className="fa-regular fa-hospital"></i>,
        },
        { type: 'divider' },
        {
            key: '4',
            label: 'Gói khám đã xem',
            icon: <SolutionOutlined />,
        },
        { type: 'divider' },
        {
            key: '5',
            label: 'Lịch hẹn',
            icon: <i className="fa-regular fa-calendar-check"></i>,
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
                        title: `Hồ sơ`,
                    },
                ]}
            />
            <div className="row mt-3">
                <div className="block__left col-4" style={{ height: '100vh' }}>
                    <Menu
                        style={{ height: '100vh' }}
                        defaultSelectedKeys={currentKey}
                        mode="inline"
                        items={items}
                        onClick={(e) => {
                            setCurrentKey([e.key]);
                            console.log('key', e.key);
                        }}
                    ></Menu>
                </div>
                <div className="block__right col-8">
                    {currentKey.includes('1') && patientProfile && (
                        <ViewProfile />
                    )}
                    {currentKey.includes('2') && <ViewWatchedDoctor />}
                    {currentKey.includes('3') && <ViewWatchedClinic />}
                    {currentKey.includes('4') && <ViewWatchedService />}
                    {currentKey.includes('5') && <ViewAppintment />}
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
