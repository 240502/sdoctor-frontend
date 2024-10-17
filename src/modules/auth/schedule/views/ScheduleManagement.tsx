import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { ListTime } from '../components/ListTime';
const { TabPane } = Tabs;
const ScheduleManagement = () => {
    const [timeType, setTimeType] = useState<string>('60 phút');
    const [activeKey, setDefaultActiveKey] = useState<string>('1');
    useEffect(() => {
        const now = new Date();
        setDefaultActiveKey(String(now.getDay()));
    }, []);
    useEffect(() => {
        console.log(activeKey);
    }, [activeKey]);
    const tabs = [
        {
            key: 1,
            tab: <h6 className="ps-3 pe-3">Thứ hai</h6>,
            component: <ListTime timeType={timeType} day={1} />,
        },
        {
            key: 2,
            tab: <h6 className="ps-3 pe-3">Thứ ba</h6>,
            component: <ListTime timeType={timeType} day={2} />,
        },
        {
            key: 3,
            tab: <h6 className="ps-3 pe-3">Thứ tư</h6>,
            component: <ListTime timeType={timeType} day={3} />,
        },
        {
            key: 4,
            tab: <h6 className="ps-3 pe-3">Thứ năm</h6>,
            component: <ListTime timeType={timeType} day={4} />,
        },
        {
            key: 5,
            tab: <h6 className="ps-3 pe-3">Thứ sáu</h6>,
            component: <ListTime timeType={timeType} day={5} />,
        },
        {
            key: 6,
            tab: <h6 className="ps-3 pe-3">Thứ bảy</h6>,
            component: <ListTime timeType={timeType} day={6} />,
        },
        {
            key: 0,
            tab: <h6 className="ps-3 pe-3">Chủ nhật</h6>,
            component: <ListTime timeType={timeType} day={0} />,
        },
    ];
    return (
        <div className="">
            <div className="">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Lịch làm việc' },
                    ]}
                ></Breadcrumb>
            </div>
            <div className="mt-3">
                <Tabs
                    activeKey={activeKey !== undefined ? activeKey : '1'}
                    onChange={(key) => setDefaultActiveKey(key)}
                >
                    {tabs.map((item: any, index: number) => {
                        return (
                            <TabPane className="" tab={item.tab} key={item.key}>
                                <div className="block__type__time">
                                    <Select
                                        style={{ width: '15%' }}
                                        defaultValue={timeType}
                                        onChange={(e) => setTimeType(e)}
                                    >
                                        <Select.Option value={'60 phút'}>
                                            60 phút
                                        </Select.Option>
                                        <Select.Option value={'30 phút'}>
                                            30 phút
                                        </Select.Option>
                                    </Select>
                                </div>
                                {item.component}
                            </TabPane>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};
export default ScheduleManagement;
