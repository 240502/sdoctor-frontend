import { CalendarOutlined, HomeOutlined, TableOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, ColorPicker, Divider, notification, Row, TabsProps, Tag } from 'antd';
import { useState } from 'react';
import { AppointmentResponseDto } from '../../../../models/appointment';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import AppointmentDetailModal from '../components/AppointmentDetailModal';
import AppointmentsTable from '../components/AppointmetsTable';
import DoctorAppointmentCalendar from '../components/DoctorAppointmentCalendar';
type NotificationType = 'success' | 'warning' | 'error';
const AppointmentManagement = () => {
    const [selectedTab, setSelectedTab] = useState<string>('1');
    const tabs: TabsProps["items"] = [
        {
            key: '1',
            label:<h6 className='mb-0'><CalendarOutlined /></h6>
        },
        {
            key: '2',
            label:<h6 className='mb-0'><TableOutlined /></h6>
        },
       
    ]
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
            <Row gutter={[24,24]}>
                <Col span={12}>
                    <h5 className="mb-2">Danh sách lịch hẹn</h5>
                </Col>
                <Col span={12} className='text-end'>
                {tabs.map((tab) => {
                        return (
                            <Button
                                type={
                                    selectedTab === (tab.key)
                                        ? 'primary'
                                        : 'default'
                                }
                                className="me-2 col-1"
                               
                                onClick={() => {
                                    if (selectedTab !== (tab.key)) {
                                        setSelectedTab((tab.key))
                                    }
                                }}
                                key={tab.key}
                            >
                                {tab.label}
                            </Button>
                        );
                })}
                </Col>
                <Col span={24}>
                {
            
                    selectedTab === "1" && <DoctorAppointmentCalendar userId={user.userId} />
                }
                {
                    selectedTab === "2" &&   <AppointmentsTable
                    openNotificationWithIcon={openNotificationWithIcon}
                    handleClickViewDetail={onClickViewButton}
                    userId={user.userId}
                    />
                }
                </Col>
            </Row>
          
            
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
