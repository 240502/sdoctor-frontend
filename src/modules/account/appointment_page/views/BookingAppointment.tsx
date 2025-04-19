import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { notificationService, invoicesService } from '../../../../services';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { BlockCalendar } from '../components/BlockCalendar';
import { InputAppointmentModal } from '../components/InputAppointmentModal';
import { patientProfileValue } from '../../../../stores/patientAtom';
import socket from '../../../../socket';
import { newAppointmentState } from '../../../../stores/appointmentAtom';
import { invoiceState } from '../../../../stores/invoice';
import { useSearchParams } from 'react-router-dom';
import SchedulesComp from '../components/SchedulesComp';
import { Schedules } from '../../../../models';
import { useFetchDoctorDetail } from '../../../../hooks';
type NotificationType = 'success' | 'error';

const BookingAppointment = () => {
    const [searchParams] = useSearchParams();

    const [api, contextHolder] = notification.useNotification();
    const now = new Date();
    const [date, setDate] = useState<string>(
        `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    );
    //

    const patientProfile = useRecoilValue(patientProfileValue);

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
    const [schedule, setSchedule] = useState<Schedules>({} as Schedules);

    const handleClickTimeButton = (schedule: Schedules) => {
        setOpenInputModal(true);
        setSchedule(schedule);
    };
    const cancelInputModal = () => {
        setOpenInputModal(false);
    };

    // const getDoctorSchedule = async () => {
    //     try {
    //         const data = {
    //             date: date,
    //             doctorId: doctor.doctorId,
    //         };
    //         const result = await scheduleService.viewSchedule(data);
    //         setSchedule(result);
    //     } catch (err: any) {
    //         setSchedule({} as DoctorSchedule);
    //     }
    // };
    // const handleTimeOverRealTime = () => {
    //     schedule.doctorScheduleDetails.forEach(
    //         (detail: DoctorScheduleDetail) => {
    //             if (detail.available === 1) {
    //                 const now = new Date();
    //                 const hours = now.getHours();
    //                 const minutes = now.getMinutes();
    //                 let startMinute = detail?.startTime?.split(':')[1];
    //                 let startHour = detail?.startTime?.split(':')[0];
    //                 if (Number(startHour) === Number(hours)) {
    //                     if (Number(startMinute) === 0) {
    //                         updateAvailableScheduleDetail(Number(detail?.id));
    //                     }
    //                     if (
    //                         Math.abs(Number(startHour) - Number(minutes)) >= 20
    //                     ) {
    //                         updateAvailableScheduleDetail(Number(detail?.id));
    //                     }
    //                     if (Number(minutes) >= Number(startHour)) {
    //                         updateAvailableScheduleDetail(Number(detail?.id));
    //                     }
    //                 }

    //                 if (
    //                     Number(startHour) > Number(hours) &&
    //                     Math.abs(Number(startHour) - Number(hours)) === 1 &&
    //                     Number(startMinute) === 0
    //                 ) {
    //                     if (Math.abs(60 - Number(minutes)) <= 20) {
    //                         updateAvailableScheduleDetail(Number(detail?.id));
    //                     }
    //                 }
    //                 if (Number(startHour) < Number(hours)) {
    //                     updateAvailableScheduleDetail(Number(detail?.id));
    //                 }
    //             }
    //         }
    //     );
    // };
    const doctorId = searchParams.get('doctorId');

    const { data, error, isFetching } = useFetchDoctorDetail(Number(doctorId));
    useEffect(() => {
        console.log('doctor', data);
    }, [data]);
    const CreateNotification = async (data: any) => {
        try {
            const res = await notificationService.createNotification(data);
        } catch (err: any) {
            console.log(err);
        }
    };
    const CreateInvoice = async (data: any) => {
        try {
            const res = await invoicesService.createInvoice(data);
            console.log('response create invoice', res?.data?.result[0][0]);

            setInvoice(res?.data?.result[0][0]);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        socket?.on('newAppointment', (newAppointment) => {
            setNewAppointment(newAppointment);
            // updateAvailableScheduleDetail(Number(scheduleDetail?.id));
        });

        return () => {
            socket?.off('newAppointment');
        };
    }, [paymentMethod]);
    useEffect(() => {
        if (newAppointment?.id) {
            const newInvoice = {
                appointmentId: newAppointment.id,
                doctorId: data.doctorId,
                serviceId: data.serviceId,
                amount: data.price,
                paymentMethod: paymentMethod,
            };
            console.log('newInvoice', newInvoice);

            CreateInvoice(newInvoice);
            const newNotification = {
                userId: data.doctorId,
                message: 'Bạn có một lịch hẹn mới!',
                appointmentId: newAppointment.id,
            };
            CreateNotification(newNotification);
        }
    }, [newAppointment]);
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log('patientProfile', patientProfile);
        console.log('doctor booking', data);
    }, []);
    useEffect(() => {
        console.log('date', date);

        // getDoctorSchedule();
    }, [date]);
    // useEffect(() => {
    //     let intervalId: any;
    //     if (schedule?.length > 0) {
    //         const newDate = new Date(date);
    //        const now = new Date();
    //         if (newDate.getDate() === now.getDate()) {
    //             intervalId = setInterval(() => {
    //                 handleTimeOverRealTime();
    //             }, 1000);
    //         }
    //     }

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [schedule?.doctorScheduleDetails?.length]);

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
                                doctor={data}
                                setDate={setDate}
                                // setSchedule={setSchedule}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="title-block mb-2">
                            <ClockCircleOutlined className="text-primary me-2" />
                            Chọn thời gian khám
                        </div>
                        <div className="border rounded p-3">
                            <SchedulesComp
                                entityId={data.doctorId ?? doctorId}
                                date={date}
                                handleClickTimeButton={handleClickTimeButton}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            {openInputModal && (
                <InputAppointmentModal
                    openModal={openInputModal}
                    cancelModal={cancelInputModal}
                    date={date}
                    doctor={data}
                    openNotification={openNotification}
                    patientProfile={patientProfile}
                    setPaymentMethod={setPaymentMethod}
                    schedule={schedule}
                />
            )}
        </div>
    );
};

export default BookingAppointment;
