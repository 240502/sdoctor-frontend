import { Button, Card, Col, Flex, notification, Row } from 'antd';
import SummaryCards from '../components/SummaryCards';
import AppointmentTable from '../components/AppointmentTable';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { userValue } from '../../../../stores/userAtom';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { RecentInvoicesTable } from '../components/RecentInvoicesTable';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../../models';
import DashboardChart from '../components/DashboardChart';
import { useFetchRevenueByWeek } from '../../../../hooks';
type NotificationType = 'success' | 'error';

const DashBoard = () => {
    const user: User = useRecoilValue<User>(userValue);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>();
    let categories = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    function getStartOfWeek(date: Date) {
        const givenDate = new Date(date);
        const dayOfWeek = givenDate.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(givenDate);
        startOfWeek.setDate(givenDate.getDate() - diff);
        return startOfWeek;
    }

    const getEndOfWeek = (date: Date) => {
        const dayOfWeek = date.getDay();
        const diff = dayOfWeek === 0 ? 6 : 7 - dayOfWeek;
        const endOfWeek = date;
        endOfWeek.setDate(endOfWeek.getDate() + diff);
        return endOfWeek;
    };
    const { data: revenueResponse } = useFetchRevenueByWeek({
        startWeek: getStartOfWeek(new Date()).toISOString().slice(0, 10),
        endWeek: getEndOfWeek(new Date()).toISOString().slice(0, 10),
        doctorId: user.userId,
    });

    useEffect(() => {
        let dataMap = new Map<string, number>();

        revenueResponse.forEach((item: any) => {
            const date = new Date(item.appointment_date);
            dataMap.set(categories[date.getDay()], Number(item.totalPrice));
        });
        const data = categories.map((item) => dataMap.get(item) || 0);
        setSeries([{ name: 'Revenue', data: data }]);
    }, [revenueResponse]);
    useEffect(() => {
        console.log('series', series);
    }, [series]);
    return (
        <div className="pe-3">
            {contextHolder}
            <Row gutter={24}>
                <Col span={6}>
                    <SummaryCards doctorId={user.userId} />
                </Col>
                <Col span={18}>
                    <DashboardChart
                        title="Chart"
                        categories={['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']}
                        series={series}
                    />
                </Col>
            </Row>
            <div className="mt-5">
                <Row gutter={24}>
                    <Col span={12}>
                        <Card
                            title={
                                <Flex className="justify-content-between align-items-center">
                                    <h6>Lịch hẹn chờ xác nhận hôm nay</h6>
                                    <Button
                                        className="border-top-0 border-start-0 border-end-0 text-primary fw-bold"
                                        onClick={() =>
                                            navigate('/admin/appointment')
                                        }
                                    >
                                        Xem thêm
                                    </Button>
                                </Flex>
                            }
                            className="rounded shadow"
                        >
                            <AppointmentTable
                                doctorId={user.userId}
                                openNotification={openNotificationWithIcon}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <RecentInvoicesTable user={user} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default DashBoard;
