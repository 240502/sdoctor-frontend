import React, { useRef, useState } from 'react';
import { Input, InputRef, Tabs } from 'antd';
import { UserService } from '../../../services/userService';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../stores/userAtom';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';
import TabPane from 'antd/es/tabs/TabPane.js';
import { FormLogin } from './FormLogin';
import { FormRegister } from './FormRegister';
import '@/assets/scss/login.scss';
export const LoginLayout = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Login',
            children: <FormLogin />,
        },
        {
            key: '2',
            label: 'Register',
            children: <FormRegister />,
        },
    ];

    return (
        <>
            <div className="container">
                <div className="row w-50 m-auto justify-content-center">
                    <Tabs defaultActiveKey="1" items={items}></Tabs>
                </div>
            </div>
        </>
    );
};
