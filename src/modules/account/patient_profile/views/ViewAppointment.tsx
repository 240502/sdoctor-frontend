import React, { useEffect, useRef, useState } from 'react';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';
import {
    Appointment,
    AppointmentViewForPatient,
} from '../../../../models/appointment';
import { AppointmentService } from '../../../../services/appointmentService';
import { Button, Table, Tag, Tooltip, notification } from 'antd';
import { TableColumnsType } from 'antd';
import {
    CloseOutlined,
    DeleteOutlined,
    EyeOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { ModalConfirmCancelAppointment } from '../components/ModalConfirmCancelAppointment';
import { useNavigate } from 'react-router-dom';
type NotificationType = 'success' | 'error';

const ViewAppointment = () => {
    const navigate = useNavigate();

    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>();
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const patientProfile = useRecoilValue(patientProfileValue);
    const [appointment, setAppointment] = useState<Appointment>(
        {} as Appointment
    );
    const [appointments, setAppointments] = useState<
        AppointmentViewForPatient[]
    >([]);

    const columns: TableColumnsType<Appointment> = [
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor_name',
        },
        {
            title: 'Địa điểm khám',
            dataIndex: 'location',
            render: (text) => (
                <p
                    style={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {text}
                </p>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'time_value',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status_name',
            render: (text) => (
                <>
                    {text === 'Đã hủy' && (
                        <Tag bordered={false} color="magenta">
                            {text.toUpperCase()}
                        </Tag>
                    )}
                    {text === 'Chờ xác nhận' && (
                        <Tag bordered={false} color="geekblue">
                            {text.toUpperCase()}
                        </Tag>
                    )}
                    {text === 'Đã xác nhận' && (
                        <Tag bordered={false} color="green">
                            {text.toUpperCase()}
                        </Tag>
                    )}
                    {text === 'Hoàn thành' && (
                        <Tag bordered={false} color="cyan">
                            {text.toUpperCase()}
                        </Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Appointment) => (
                <>
                    {record.status_id === 4 && (
                        <Tooltip placement="topLeft" title={'Đặt lại'}>
                            <Button
                                className="ms-1 me-1"
                                onClick={() => {
                                    navigate(
                                        '/doctor/detail/' + record.doctor_id
                                    );
                                }}
                            >
                                <RedoOutlined />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                        <Button
                            className="ms-1 me-1 border border-info"
                            onClick={() => {
                                setIsModalOpen(true);
                                setAppointment(record);
                                console.log('appointment', record);
                            }}
                        >
                            <EyeOutlined className="text-info" />
                        </Button>
                    </Tooltip>
                    {record.status_id === 1 && (
                        <Tooltip placement="topLeft" title={'Hủy lịch hẹn'}>
                            <Button
                                className="ms-1 me-1"
                                danger
                                onClick={() => {
                                    console.log(record);
                                    setIsOpenModalConfirm(true);
                                    setAppointment(record);
                                }}
                            >
                                <CloseOutlined className="text-danger" />
                            </Button>
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    const getAppointmentByPatientPhone = async () => {
        const data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            phone: patientProfile.patient_phone,
            statusId: null,
        };
        try {
            const res = await AppointmentService.viewAppointmentForPatient(
                data
            );
            console.log(res);
            setAppointments(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
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

    useEffect(() => {
        getAppointmentByPatientPhone();
    }, [pageIndex, pageSize]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <PatientProfileLayout breadcrumb={'Lịch hẹn'}>
            {appointments.length > 0 ? (
                <>
                    {contextHolder}{' '}
                    <Table<Appointment>
                        bordered
                        columns={columns}
                        dataSource={appointments}
                    />
                    {isModalOpen && (
                        <ModalViewAppointment
                            handleCancelModal={handleCancelModal}
                            isModalOpen
                            appointment={appointment}
                        />
                    )}
                    {isOpenModalConfirm && (
                        <ModalConfirmCancelAppointment
                            isOpenModalConfirm
                            handleCancelModalConfirm={handleCancelModalConfirm}
                            appointment={appointment}
                            setIsOpenModalConfirm={setIsOpenModalConfirm}
                            openNotificationWithIcon={openNotificationWithIcon}
                            getAppointmentByPatientPhone={
                                getAppointmentByPatientPhone
                            }
                        />
                    )}
                </>
            ) : (
                <div>Không có lịch hẹn nào</div>
            )}
        </PatientProfileLayout>
    );
};
export default ViewAppointment;
