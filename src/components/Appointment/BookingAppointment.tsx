import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, notification, Row } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { scheduleService } from '../../services/doctorScheduleService';
import { useRecoilValue } from 'recoil';
import { doctorValue } from '../../stores/doctorAtom';
import { DoctorSchedule } from '../../models/doctorSchedule';
import { BlockCalendar } from './BlockCalendar';
import { TimeButton } from './TimeButton';
import { Time } from '../../models/time';
import { DoctorScheduleDetail } from '../../models/doctorScheduleDetails';
import { InputAppointmentModal } from './InputAppointmentModal';
import { patientProfileValue } from '../../stores/patientAtom';
import { PatientProfile } from '../../models/patient_profile';
import { doctorScheduleDetaiService } from '../../services/doctorScheduleDetailService';
import socket from '../../socket';
type NotificationType = 'success' | 'error';
// import weekday from 'dayjs/plugin/weekday';
// import localeData from 'dayjs/plugin/localeData';
// import isoWeek from 'dayjs/plugin/isoWeek';

// dayjs.extend(weekday);
// dayjs.extend(localeData);
// dayjs.extend(isoWeek);
// dayjs.locale('vi');

const BookingAppointment = () => {
    const [api, contextHolder] = notification.useNotification();
    const doctor = useRecoilValue(doctorValue);
    const currentDate = new Date();
    const [date, setDate] = useState<string>();
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const patientProfile = useRecoilValue(patientProfileValue);
    const [patientProfileCopy, setPatientProfileCopy] =
        useState<PatientProfile>({} as PatientProfile);
    const [times, setTimes] = useState<Time[]>([]);
    const [time, setTime] = useState<Time>({} as Time);
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);

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

    const handleClickTimeButton = (time: Time) => {
        setTime(time);
        setOpenInputModal(true);
    };
    const cancelInputModal = () => {
        setTime({} as Time);
        setOpenInputModal(false);
    };

    const updateAvailableScheduleDetail = async (scheduleDetailId: number) => {
        try {
            const res =
                await doctorScheduleDetaiService.updateAvailableScheduleDetail(
                    scheduleDetailId
                );

            getDoctorSchedule();
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const getDoctorSchedule = async () => {
        const data = {
            date: date,
            subscriberId: doctor.doctor_id,
        };
        const result = await scheduleService.viewScheduleForClient(data);
        console.log(result);
        setSchedule(result.data);
    };

    useEffect(() => {
        console.log(doctor);
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
        window.scrollTo(0, 0);
        setPatientProfileCopy(patientProfile);
        socket.on('newAppointment', (newAppointment) => {
            const scheduleDetail = schedule?.listScheduleDetails.find(
                (scheduleDetail: DoctorScheduleDetail) => {
                    return scheduleDetail.time_id === newAppointment.time_id;
                }
            );

            updateAvailableScheduleDetail(Number(scheduleDetail?.id));
        });

        return () => {
            socket.off('newAppointment');
        };
    }, []);
    useEffect(() => {
        getDoctorSchedule();
    }, [date]);

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
                                setTimes={setTimes}
                                times={times}
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
                                            return (
                                                <Col span={6}>
                                                    <TimeButton
                                                        handleClickTimeButton={
                                                            handleClickTimeButton
                                                        }
                                                        timeId={detail.time_id}
                                                    />
                                                </Col>
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
                    time={time}
                    date={date}
                    doctor={doctor}
                    patientProfileCopy={patientProfileCopy}
                    openNotification={openNotification}
                />
            )}
        </div>
    );
};

export default BookingAppointment;
