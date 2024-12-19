import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row, Button } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { scheduleService } from '../../../../services/doctorScheduleService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
        `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`
    );
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const [scheduleDetail, setScheduleDetail] = useState<DoctorScheduleDetail>(
        {} as DoctorScheduleDetail
    );
    const patientProfile = useRecoilValue(patientProfileValue);
    const [patientProfileCopy, setPatientProfileCopy] =
        useState<PatientProfile>({} as PatientProfile);
    const setNewAppointment = useSetRecoilState(newAppointmentState);
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
            console.log('scheduleId', scheduleDetailId);
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
                subscriberId: doctor.doctor_id,
            };
            const result = await scheduleService.viewScheduleForClient(data);
            setSchedule(result.data);
        } catch (err: any) {
            setSchedule({} as DoctorSchedule);
        }
    };
    const handleTimeOverRealTime = () => {
        schedule.listScheduleDetails.forEach((detail: DoctorScheduleDetail) => {
            if (detail.available === 1) {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                let startMinute = detail?.start_time?.split(':')[1];
                let startHour = detail?.start_time?.split(':')[0];
                if (Number(startHour) === Number(hours)) {
                    if (Number(startMinute) === 0) {
                        updateAvailableScheduleDetail(Number(detail?.id));
                    }
                    if (Math.abs(Number(startHour) - Number(minutes)) >= 20) {
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
        });
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
            console.log(res?.data?.result[0][0]);
            setInvoice(res?.data?.result[0][0]);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        console.log(paymentMethod);
        socket.on('newAppointment', (newAppointment) => {
            setNewAppointment(newAppointment);
            const newInvoice = {
                appointment_id: newAppointment.id,
                doctor_id: newAppointment.doctor_id,
                service_id: newAppointment.service_id,
                amount: newAppointment.price,
                payment_method: paymentMethod,
                patient_name: newAppointment.patient_name,
                patient_phone: newAppointment.patient_phone,
            };
            CreateInvoice(newInvoice);
            const scheduleDetail = schedule?.listScheduleDetails?.find(
                (scheduleDetail: DoctorScheduleDetail) => {
                    return scheduleDetail.time_id === newAppointment.time_id;
                }
            );

            const newNotification = {
                user_id: doctor.user_id,
                message: 'Bạn có một lịch hẹn mới!',
                appointment_id: newAppointment.id,
            };
            CreateNotification(newNotification);

            updateAvailableScheduleDetail(Number(scheduleDetail?.id));
        });

        return () => {
            socket.off('newAppointment');
        };
    }, [schedule, paymentMethod]);
    useEffect(() => {
        window.scrollTo(0, 0);
        setPatientProfileCopy(patientProfile);
    }, []);
    useEffect(() => {
        getDoctorSchedule();
    }, [date]);
    useEffect(() => {
        let intervalId: any;
        if (schedule?.listScheduleDetails?.length > 0) {
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
    }, [schedule?.listScheduleDetails?.length]);

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
                                    {schedule.listScheduleDetails.map(
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
                                                        {detail.start_time} -{' '}
                                                        {detail.end_time}
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
