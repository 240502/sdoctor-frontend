import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, notification } from 'antd';
import { useState } from 'react';
import AppointmentTable from '../components/AppointmentTable';
import { AppointmentResponseDto } from '../../../../models/appointment';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
type NotificationType = 'success' | 'warning' | 'error';
const AppointmentManagement = () => {
    const user = useRecoilValue(userValue);
    const [api, contextHoler] = notification.useNotification();
    const [appointment, setAppointment] = useState<AppointmentResponseDto>(
        {} as AppointmentResponseDto
    );
    const [openViewAppointmentModal, setOpenViewAppointmentModal] =
        useState<boolean>(false);
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };

    const onClickViewButton = (appointment: AppointmentResponseDto) => {
        setAppointment(appointment);
        console.log('appointment', appointment);

        setOpenViewAppointmentModal(true);
    };
    const cancelViewAppointmentModal = () => {
        setAppointment({} as AppointmentResponseDto);
        setOpenViewAppointmentModal(false);
    };

    return (
        <div className="container">
            {contextHoler}
            <div className="block__filter">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Lịch hẹn',
                        },
                    ]}
                />
                <Divider />
            </div>
            <div className="block__list__appointment">
                <h5 className="mb-3">Danh sách lịch hẹn</h5>
                <AppointmentTable
                    openNotificationWithIcon={openNotificationWithIcon}
                    handleClickViewDetail={onClickViewButton}
                    userId={user.userId}
                />
            </div>
            {openViewAppointmentModal && (
                <AppointmentDetailModal
                    isModalOpen={openViewAppointmentModal}
                    cancelModal={cancelViewAppointmentModal}
                    appointment={appointment}
                />
            )}
        </div>
    );
};
export default AppointmentManagement;
