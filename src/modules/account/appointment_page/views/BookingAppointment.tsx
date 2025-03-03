import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row, Button } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { scheduleService } from '../../../../services/doctorScheduleService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { doctorValue } from '../../../../stores/doctorAtom';
import { DoctorSchedule } from '../../../../models/doctorSchedule';
import { BlockCalendar } from '../components/BlockCalendar';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
import { InputAppointmentModal } from '../components/InputAppointmentModal';
import { patientProfileValue } from '../../../../stores/patientAtom';
import { PatientProfile } from '../../../../models/patient_profile';
import { doctorScheduleDetailService } from '../../../../services/doctorScheduleDetailService';
import socket from '../../../../socket';
import { NotificationService } from '../../../../services/notificationService';
import { newAppointmentState } from '../../../../stores/appointmentAtom';
import { invoicesService } from '../../../../services/invoicesService';
import { invoiceState } from '../../../../stores/invoice';
type NotificationType = 'success' | 'error';

const BookingAppointment = () => {
    const [api, contextHolder] = notification.useNotification();
    const doctor = useRecoilValue(doctorValue);
    const now = new Date();
    const [date, setDate] = useState<string>(
        `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    );
    //
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const [scheduleDetail, setScheduleDetail] = useState<DoctorScheduleDetail>(
        {} as DoctorScheduleDetail
    );
    const patientProfile = useRecoilValue(patientProfileValue);
    const [patientProfileCopy, setPatientProfileCopy] =
        useState<PatientProfile>({} as PatientProfile);
    const [newAppointment, setNewAppointment] =
        useRecoilState(newAppointmentState);
    const setInvoice = useSetRecoilState(invoiceState);
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<number>(1);
    const openNotification = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };

    const handleClickTimeButton = (scheduleDetail: DoctorScheduleDetail) => {
        setOpenInputModal(true);
        setScheduleDetail(scheduleDetail);
    };
    const cancelInputModal = () => {
        setOpenInputModal(false);
    };

    const updateAvailableScheduleDetail = async (scheduleDetailId: number) => {
        try {
            const res =
                await doctorScheduleDetailService.updateAvailableScheduleDetail(
                    scheduleDetailId
                );

            getDoctorSchedule();
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const getDoctorSchedule = async () => {
        try {
            const data = {
                date: date,
                doctorId: doctor.doctorId,
            };
            const result = await scheduleService.viewSchedule(data);
            setSchedule(result);
        } catch (err: any) {
            setSchedule({} as DoctorSchedule);
        }
    };
    const handleTimeOverRealTime = () => {
        schedule.doctorScheduleDetails.forEach(
            (detail: DoctorScheduleDetail) => {
                if (detail.available === 1) {
                    const now = new Date();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    let startMinute = detail?.startTime?.split(':')[1];
                    let startHour = detail?.startTime?.split(':')[0];
                    if (Number(startHour) === Number(hours)) {
                        if (Number(startMinute) === 0) {
                            updateAvailableScheduleDetail(Number(detail?.id));
                        }
                        if (
                            Math.abs(Number(startHour) - Number(minutes)) >= 20
                        ) {
                            updateAvailableScheduleDetail(Number(detail?.id));
                        }
                        if (Number(minutes) >= Number(startHour)) {
                            updateAvailableScheduleDetail(Number(detail?.id));
                        }
                    }

                    if (
                        Number(startHour) > Number(hours) &&
                        Math.abs(Number(startHour) - Number(hours)) === 1 &&
                        Number(startMinute) === 0
                    ) {
                        if (Math.abs(60 - Number(minutes)) <= 20) {
                            updateAvailableScheduleDetail(Number(detail?.id));
                        }
                    }
                    if (Number(startHour) < Number(hours)) {
                        updateAvailableScheduleDetail(Number(detail?.id));
                    }
                }
            }
        );
    };

    const CreateNotification = async (data: any) => {
        try {
            const res = await NotificationService.createNotification(data);
        } catch (err: any) {
            console.log(err);
        }
    };
    const CreateInvoice = async (data: any) => {
        try {
            const res = await invoicesService.createInvoice(data);
            setInvoice(res?.data?.result[0]);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        socket?.on('newAppointment', (newAppointment) => {
            console.log(newAppointment);
            setNewAppointment(newAppointment);
            updateAvailableScheduleDetail(Number(scheduleDetail?.id));
        });

        return () => {
            socket?.off('newAppointment');
        };
    }, [schedule, paymentMethod]);
    useEffect(() => {
        if (newAppointment?.id) {
            console.log('create invoice');
            const newInvoice = {
                appointmentId: newAppointment.id,
                doctorId: newAppointment.doctorId,
                serviceId: newAppointment.serviceId,
                amount: newAppointment.price,
                paymentMethod: paymentMethod,
                patientName: newAppointment.patientName,
                patientPhone: newAppointment.patientPhone,
            };
            CreateInvoice(newInvoice);
            const newNotification = {
                userId: doctor.userId,
                message: 'Bạn có một lịch hẹn mới!',
                appointmentId: newAppointment.id,
            };
            CreateNotification(newNotification);
        }
    }, [newAppointment]);
    useEffect(() => {
        window.scrollTo(0, 0);
        setPatientProfileCopy(patientProfile);
        console.log('doctor booking', doctor);
    }, []);
    useEffect(() => {
        getDoctorSchedule();
    }, [date]);
    useEffect(() => {
        let intervalId: any;
        if (schedule?.doctorScheduleDetails?.length > 0) {
            const newDate = new Date(date);
            const now = new Date();
            if (newDate.getDate() === now.getDate()) {
                intervalId = setInterval(() => {
                    handleTimeOverRealTime();
                }, 1000);
            }
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [schedule?.doctorScheduleDetails?.length]);

    return (
        <div className="container mt-4 mb-4">
            {contextHolder}
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },
                    {
                        title: 'Đặt lịch hẹn',
                    },
                ]}
            />
            <div className="mt-4">
                <h6 className="heading">Phiếu hẹn khám</h6>
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="title-block mb-2">
                            <CalendarOutlined className="text-primary me-2" />{' '}
                            Chọn ngày khám
                        </div>
                        <div className="border rounded p-3">
                            <BlockCalendar
                                date={date}
                                doctor={doctor}
                                setDate={setDate}
                                setSchedule={setSchedule}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="title-block mb-2">
                            <ClockCircleOutlined className="text-primary me-2" />
                            Chọn thời gian khám
                        </div>
                        <div className="border rounded p-3">
                            {schedule?.id ? (
                                <Row gutter={[24, 24]}>
                                    {schedule.doctorScheduleDetails.map(
                                        (detail: DoctorScheduleDetail) => {
                                            return detail.available === 1 ? (
                                                <Col span={6}>
                                                    <Button
                                                        onClick={() => {
                                                            handleClickTimeButton(
                                                                detail
                                                            );
                                                        }}
                                                    >
                                                        {detail.startTime} -{' '}
                                                        {detail.endTime}
                                                    </Button>
                                                </Col>
                                            ) : (
                                                <></>
                                            );
                                        }
                                    )}
                                </Row>
                            ) : (
                                <p>Bác sĩ không có thời gian trong hôm nay</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
            {openInputModal && (
                <InputAppointmentModal
                    openModal={openInputModal}
                    cancelModal={cancelInputModal}
                    date={date}
                    doctor={doctor}
                    patientProfileCopy={patientProfileCopy}
                    openNotification={openNotification}
                    setPatientProfileCopy={setPatientProfileCopy}
                    patientProfile={patientProfile}
                    setPaymentMethod={setPaymentMethod}
                    scheduleDetail={scheduleDetail}
                />
            )}
        </div>
    );
};

export default BookingAppointment;
