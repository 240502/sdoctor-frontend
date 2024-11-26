import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BarChart from './BarChart';

export const WeeklyOverview = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Doanh thu',
            children: <BarChart type={'revenue'} />,
        },
        {
            key: '2',
            label: 'Lịch hẹn',
            children: <BarChart type="appointment" />,
        },
    ];

    return (
        <Card title="Báo cáo tuần" className="shadow">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange}></Tabs>
        </Card>
    );
};
