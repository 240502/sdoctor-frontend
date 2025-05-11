import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, Row, message } from 'antd';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BlockCalendar, InputAppointmentModal } from '../components';
import { patientProfileState } from '../../../../stores/patientAtom';
import { getSocket } from '../../../../socket';
import { useSearchParams } from 'react-router-dom';
import SchedulesComp from '../components/SchedulesComp';
import { PatientProfile, Schedules } from '../../../../models';
import {
    useFetchDoctorDetail,
    useFetchSchedulesByEntityIdAndDate,
} from '../../../../hooks';
import dayjs from 'dayjs';
import { NoticeType } from 'antd/es/message/interface';
import ProfileSelectionModal from '../components/ProfileSelectionModal';

const BookingAppointment = () => {
    const [searchParams] = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const now = dayjs();
    const [date, setDate] = useState<string>(now.format('YYYY-MM-DD'));
    const [patientProfile, setPatientProfile] =
        useRecoilState(patientProfileState);

    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const openMessage = (type: NoticeType, content: string) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    const [visibleProfileSelectionModal, setVisibleProfileSelectionModal] =
        useState<boolean>(false);
    const [schedule, setSchedule] = useState<Schedules>({} as Schedules);

    const handleClickTimeButton = (schedule: Schedules) => {
        // setOpenInputModal(true);
        setVisibleProfileSelectionModal(true);
        setSchedule(schedule);
    };
    const cancelInputModal = () => {
        setOpenInputModal(false);
    };

    const doctorId = searchParams.get('doctorId');

    const { data: doctorResponse } = useFetchDoctorDetail(Number(doctorId));
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
    const onCloseProfileSelectionModa = () => {
        setVisibleProfileSelectionModal(false);
    };
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

    useEffect(() => {
        const socket = getSocket();
        socket?.on('newAppointment', (newAppointment) => {
            console.log('newAppointment', newAppointment);
            refetch();
        });
        return () => {
            socket?.off('newAppointment');
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const onSelectProfile = (profile: PatientProfile) => {
        setPatientProfile(profile);
        setVisibleProfileSelectionModal(false);
        setOpenInputModal(true);
    };

    useEffect(() => {
        console.log('profile', patientProfile);
    }, [patientProfile]);
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
                    openMessage={openMessage}
                    patientProfile={patientProfile}
                    schedule={schedule}
                    refetch={refetch}
                />
            )}
            {visibleProfileSelectionModal && (
                <ProfileSelectionModal
                    visible={visibleProfileSelectionModal}
                    onClose={onCloseProfileSelectionModa}
                    onSelectProfile={onSelectProfile}
                />
            )}
        </div>
    );
};

export default BookingAppointment;
