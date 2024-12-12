import { Button, Card, Flex, notification } from 'antd';
import SummaryCards from '../components/SummaryCards';
import AppointmentTable from '../components/AppointmentTable';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { configValue, userState, userValue } from '../../../../stores/userAtom';
import { useAppointments } from '../../../../hooks/useAppointments';
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { Appointment } from '../../../../models/appointment';
import { appointmentListInDayState } from '../../../../stores/appointmentAtom';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { RecentPatientCard } from '../components/RecentPatientCard';
import { RecentInvoicesTable } from '../components/RecentInvoicesTable';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../../../services/doctorService';
type NotificationType = 'success' | 'error';

const DashBoard = () => {
    const user = useRecoilValue(userValue);
    const setUser = useSetRecoilState(userState);
    const [appointments, setAppointments] = useRecoilState(
        appointmentListInDayState
    );
    const getDoctorByUserId = async (userId: number) => {
        try {
            const res = await doctorService.getDoctorByUserId(userId);
            setUser({ ...user, doctor_id: res.doctor_id });
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const config = useRecoilValue(configValue);
    const naviage = useNavigate();
    const [appointment, setAppointment] = useState<Appointment>();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const { totalPatientInDay, totalPatientExaminedInDay, fetchData } =
        useAppointments(config, pageIndex, pageSize, user.doctor_id);

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
    };
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
    const handleClickViewDetail = (record: Appointment) => {
        setAppointment(record);
        setIsModalOpen(true);
    };
    const handleClickRejectBtn = (record: Appointment) => {
        setAppointment(record);
        setIsOpenModalConfirm(true);
    };

    const onPageChange = (current: number, pageSize: number) => {
        setPageIndex(current);
        setPageSize(pageSize);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        getDoctorByUserId(user.user_id);
    }, []);
    return (
        <div className="pe-3">
            {contextHolder}
            <Flex gap="middle">
                <div className="col-3">
                    <SummaryCards
                        totalPatientInDay={totalPatientInDay}
                        totalPatientExaminedInDay={totalPatientExaminedInDay}
                    />
                </div>
                <div className="col-9">
                    <Card
                        title={
                            <Flex className="justify-content-between align-items-center">
                                <h6>Lịch hẹn chờ xác nhận hôm nay</h6>
                                <Button
                                    className="border-top-0 border-start-0 border-end-0 text-primary fw-bold"
                                    onClick={() =>
                                        naviage('/admin/appointment')
                                    }
                                >
                                    Xem thêm
                                </Button>
                            </Flex>
                        }
                        className="rounded shadow"
                    >
                        <AppointmentTable
                            data={appointments}
                            onPageChange={onPageChange}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            handleClickViewDetail={handleClickViewDetail}
                            handleClickRejectBtn={handleClickRejectBtn}
                            openNotificationWithIcon={openNotificationWithIcon}
                            fetchData={fetchData}
                        />
                    </Card>
                </div>
            </Flex>
            <div className="mt-5">
                <Flex gap="middle">
                    <div className="col-4">
                        <div>
                            <WeeklyOverview />
                        </div>
                        {/* <div className="mt-5">
                            <RecentPatientCard />
                        </div> */}
                    </div>
                    <div className="col-8">
                        <RecentInvoicesTable />
                    </div>
                </Flex>
            </div>

            {isModalOpen && (
                <ModalViewAppointment
                    handleCancelModal={handleCancelModal}
                    isModalOpen={isModalOpen}
                    appointment={appointment}
                />
            )}
        </div>
    );
};
export default DashBoard;
