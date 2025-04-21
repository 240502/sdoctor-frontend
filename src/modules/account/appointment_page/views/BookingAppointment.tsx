import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { notificationService, invoicesService } from '../../../../services';
import {
    errorSelector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';
import { BlockCalendar } from '../components/BlockCalendar';
import { InputAppointmentModal } from '../components/InputAppointmentModal';
import { patientProfileValue } from '../../../../stores/patientAtom';
import socket from '../../../../socket';
import { newAppointmentState } from '../../../../stores/appointmentAtom';
import { invoiceState } from '../../../../stores/invoice';
import { useSearchParams } from 'react-router-dom';
import SchedulesComp from '../components/SchedulesComp';
import { Schedules } from '../../../../models';
import {
    useFetchDoctorDetail,
    useFetchSchedulesByEntityIdAndDate,
    useUpdateScheduleStatus,
} from '../../../../hooks';
import dayjs from 'dayjs';
type NotificationType = 'success' | 'error';

const BookingAppointment = () => {
    const [searchParams] = useSearchParams();

    const [api, contextHolder] = notification.useNotification();
    const now = dayjs();
    const [date, setDate] = useState<string>(now.format('YYYY-MM-DD'));
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

    const {
        data: doctorResponse,
        error: doctorError,
        isFetching: isFetchingDoctor,
    } = useFetchDoctorDetail(Number(doctorId));
    const {
        data: scheduleReponse,
        error: scheduleError,
        isFetching: isFetchingSchedule,
        refetch,
    } = useFetchSchedulesByEntityIdAndDate({
        entityId: Number(doctorId),
        date: date,
        entityType: 'doctor',
    });
    const [schedules, setSchedules] = useState<Schedules[]>([]);
    function markScheduleIfExpired(schedules: Schedules[]): {
        schedules: Schedules[];
        updatedScheduleIds: number[];
    } {
        const now = dayjs();
        const updatedScheduleIds: number[] = [];
        let newSchedules: Schedules[] = schedules.map(
            (schedule: Schedules): Schedules => {
                const [startHour, startMinute] = schedule.startTime
                    .split(':')
                    .map(Number);
                const startTime = dayjs()
                    .hour(startHour)
                    .minute(startMinute)
                    .second(0);
                const diffMinutes = now.diff(startTime, 'minute');
                if (diffMinutes > -20) {
                    updatedScheduleIds.push(schedule.id);
                    return { ...schedule, status: 'expired' };
                } else {
                    return schedule;
                }
            }
        );

        return {
            schedules: newSchedules ?? [],
            updatedScheduleIds: updatedScheduleIds,
        };
    }
    const updateScheduleStatus = useUpdateScheduleStatus();
    useEffect(() => {
        let intervalId: any;
        if (date === dayjs().format('YYYY-MM-DD')) {
            if (scheduleReponse?.data && scheduleReponse.data?.length > 0) {
                intervalId = setInterval(() => {
                    console.log('chạy');
                    let payload: any = [];
                    const { schedules, updatedScheduleIds } =
                        markScheduleIfExpired(scheduleReponse?.data);
                    if (updatedScheduleIds.length > 0) {
                        console.log('update scheudle', payload);
                        refetch();
                    }
                }, 60000);

                // gọi 1 lần ngay từ đầu (không cần đợi 1 phút)
                const { schedules, updatedScheduleIds } = markScheduleIfExpired(
                    scheduleReponse.data
                );
                if (updatedScheduleIds.length > 0) {
                    const newSchedules = schedules.filter(
                        (schedule: Schedules) => schedule.status === 'available'
                    );
                    setSchedules(newSchedules);
                } else {
                    setSchedules(schedules);
                }
            }
        } else {
            setSchedules(scheduleReponse?.data ?? []);
        }

        return () => {
            clearInterval(intervalId); // Cleanup khi unmount
        };
    }, [scheduleReponse]);

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
        });

        return () => {
            socket?.off('newAppointment');
        };
    }, [paymentMethod]);
    useEffect(() => {
        if (newAppointment?.id) {
            const newInvoice = {
                appointmentId: newAppointment.id,
                doctorId: doctorResponse.doctorId,
                serviceId: doctorResponse.serviceId,
                amount: doctorResponse.price,
                paymentMethod: paymentMethod,
            };
            console.log('newInvoice', newInvoice);

            CreateInvoice(newInvoice);
            const newNotification = {
                userId: doctorResponse.doctorId,
                message: 'Bạn có một lịch hẹn mới!',
                appointmentId: newAppointment.id,
            };
            CreateNotification(newNotification);
        }
    }, [newAppointment]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                                doctor={doctorResponse}
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
                                schedules={schedules}
                                isFetching={isFetchingSchedule}
                                error={scheduleError}
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
                    doctor={doctorResponse}
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
