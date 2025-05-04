import { Button, Card, Col, Flex, notification, Row } from 'antd';
import SummaryCards from '../components/SummaryCards';
import AppointmentTable from '../components/AppointmentTable';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { userValue } from '../../../../stores/userAtom';
import { RecentInvoicesTable } from '../components/RecentInvoicesTable';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../../models';
import DashboardChart from '../components/DashboardChart';
import { useFetchRevenueByWeek } from '../../../../hooks';
import { useStatisticAppointmentByDay } from '../../../../hooks/appointments/useStatisticAppointmentByDay';
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
    const [chartSeries, setChartSeries] = useState<
        { name: string; type: string; data: number[]; yAxisIndex: number }[]
    >([]);
    // Nhãn ngày trong tuần (Thứ hai đến Chủ nhật)
    const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
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
    // Lấy dữ liệu từ hooks
    const { data: revenueRecords } = useFetchRevenueByWeek({
        startWeek: getStartOfWeek(new Date()).toISOString().slice(0, 10),
        endWeek: getEndOfWeek(new Date()).toISOString().slice(0, 10),
        doctorId: user.userId,
    });

    const { data: appointmentRecords } = useStatisticAppointmentByDay({
        startWeek: getStartOfWeek(new Date()).toISOString().slice(0, 10),
        endWeek: getEndOfWeek(new Date()).toISOString().slice(0, 10),
        doctorId: user.userId,
    });
    useEffect(() => {
        // Kiểm tra dữ liệu đầu vào
        if (
            !Array.isArray(revenueRecords) ||
            !Array.isArray(appointmentRecords)
        ) {
            console.warn('Invalid revenue or appointment records');
            setChartSeries([
                {
                    name: 'Revenue',
                    type: 'bar',
                    data: new Array(weekdayLabels.length).fill(0),
                    yAxisIndex: 0,
                },
                {
                    name: 'Appointment',
                    type: 'line',
                    data: new Array(weekdayLabels.length).fill(0),
                    yAxisIndex: 1,
                },
            ]);
            return;
        }

        // Khởi tạo Map để lưu trữ dữ liệu theo ngày
        const revenueByDay = new Map<string, number>();
        const appointmentsByDay = new Map<string, number>();

        // Xử lý dữ liệu doanh thu
        revenueRecords.forEach((record) => {
            if (!record?.appointmentDate || record.totalPrice == null) return;
            const appointmentDate = new Date(record.appointmentDate);
            if (isNaN(appointmentDate.getTime())) return; // Bỏ qua ngày không hợp lệ
            const dayIndex = appointmentDate.getDay();
            // Ánh xạ: T2 (1) -> T2, T3 (2) -> T3, ..., CN (0) -> CN
            const dayLabel = weekdayLabels[dayIndex === 0 ? 6 : dayIndex - 1];
            if (dayLabel) {
                revenueByDay.set(dayLabel, Number(record.totalPrice));
            }
        });

        // Xử lý dữ liệu lịch hẹn
        appointmentRecords.forEach((record) => {
            if (!record?.appointmentDate || record.totalAppointments == null)
                return;
            const appointmentDate = new Date(record.appointmentDate);
            if (isNaN(appointmentDate.getTime())) return; // Bỏ qua ngày không hợp lệ
            const dayIndex = appointmentDate.getDay();
            const dayLabel = weekdayLabels[dayIndex === 0 ? 6 : dayIndex - 1];
            if (dayLabel) {
                appointmentsByDay.set(
                    dayLabel,
                    Number(record.totalAppointments)
                );
            }
        });

        // Tạo dữ liệu cho series
        const revenueSeriesData = weekdayLabels.map(
            (label) => revenueByDay.get(label) || 0
        );
        const appointmentSeriesData = weekdayLabels.map(
            (label) => appointmentsByDay.get(label) || 0
        );

        // Cập nhật series
        const newSeries = [
            {
                name: 'Revenue',
                type: 'bar',
                data: revenueSeriesData,
                yAxisIndex: 0,
            },
            {
                name: 'Appointment',
                type: 'line',
                data: appointmentSeriesData,
                yAxisIndex: 1,
            },
        ];
        setChartSeries(newSeries);
    }, [revenueRecords, appointmentRecords]);

    return (
        <div className="pe-3">
            {contextHolder}
            <Row gutter={24}>
                <Col span={6}>
                    <SummaryCards doctorId={user.userId} />
                </Col>
                <Col span={18}>
                    <DashboardChart
                        title="Revenue and Appointment Chart"
                        categories={weekdayLabels}
                        series={chartSeries}
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
