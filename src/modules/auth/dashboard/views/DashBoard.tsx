import { Card, Flex, notification } from 'antd';
import SummaryCards from '../components/SummaryCards';
import AppointmentTable from '../components/AppointmentTable';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { configValue, userValue } from '../../../../stores/userAtom';
import { useAppointments } from '../../../../hooks/useAppointments';
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { Appointment } from '../../../../models/appointment';
import { ModalConfirmCancelAppointment } from '../components/ModalConfirmCancelAppointment';
import { appointmentListInDayState } from '../../../../stores/appointmentAtom';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { RecentPatientCard } from '../components/RecentPatientCard';
import { RecentInvoicesTable } from '../components/RecentInvoicesTable';
type NotificationType = 'success' | 'error';

const DashBoard = () => {
    const user = useRecoilValue(userValue);

    const [appointments, setAppointments] = useRecoilState(
        appointmentListInDayState
    );
    const config = useRecoilValue(configValue);

    const [appointment, setAppointment] = useState<Appointment>();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const {
        totalPatientInDay,
        totalPatientExaminedInDay,
        pageCount,
        fetchData,
    } = useAppointments(config, pageIndex, pageSize, user.object_id);

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
                    <Card title="Lịch hẹn hôm nay" className="rounded shadow">
                        <AppointmentTable
                            data={appointments}
                            onPageChange={onPageChange}
                            pageCount={pageCount}
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
                        <div className="mt-5">
                            <RecentPatientCard />
                        </div>
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
            {isOpenModalConfirm && (
                <ModalConfirmCancelAppointment
                    isOpenModalConfirm={isOpenModalConfirm}
                    handleCancelModalConfirm={handleCancelModalConfirm}
                    appointment={appointment}
                    setIsOpenModalConfirm={setIsOpenModalConfirm}
                    openNotificationWithIcon={openNotificationWithIcon}
                    setAppointments={setAppointments}
                    fetchData={fetchData}
                />
            )}
        </div>
    );
};
export default DashBoard;
