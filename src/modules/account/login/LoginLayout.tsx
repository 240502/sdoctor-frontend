import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
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
