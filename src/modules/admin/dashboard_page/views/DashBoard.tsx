import { Button, Card, Col, Flex, notification, Row } from 'antd';
import SummaryCards from '../components/SummaryCards';
import AppointmentTable from '../components/AppointmentTable';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { userValue } from '../../../../stores/userAtom';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { RecentInvoicesTable } from '../components/RecentInvoicesTable';
import { useNavigate } from 'react-router-dom';
type NotificationType = 'success' | 'error';

const DashBoard = () => {
    const user = useRecoilValue(userValue);
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
    return (
        <div className="pe-3">
            {contextHolder}
            <Flex gap="middle">
                <div className="col-3">
                    <SummaryCards doctorId={4} />
                </div>
                <div className="col-9">
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
                </div>
            </Flex>
            <div className="mt-5">
                <Row gutter={24}>
                    <Col span={10}>
                        <div>
                            <WeeklyOverview />
                        </div>
                    </Col>
                    <Col span={14}>
                        <RecentInvoicesTable user={user} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default DashBoard;
