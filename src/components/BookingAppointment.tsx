import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, Calendar, Row, Select } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { scheduleService } from '../services/doctorScheduleService';
import { useRecoilValue } from 'recoil';
import { doctorValue } from '../stores/doctorAtom';
import { DoctorSchedule } from '../models/doctorSchedule';
import { BlockCalendar } from './BlockCalendar';
import { TimeButton } from './TimeButton';
import { TimeService } from '../services/timeService';
import { Time } from '../models/time';
import { DoctorScheduleDetail } from '../models/doctorScheduleDetails';
// import weekday from 'dayjs/plugin/weekday';
// import localeData from 'dayjs/plugin/localeData';
// import isoWeek from 'dayjs/plugin/isoWeek';

// dayjs.extend(weekday);
// dayjs.extend(localeData);
// dayjs.extend(isoWeek);
// dayjs.locale('vi');

const BookingAppointment = () => {
    const doctor = useRecoilValue(doctorValue);
    const currentDate = new Date();
    const [date, setDate] = useState<string>();
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const [times, setTimes] = useState<Time[]>([]);

    const getTimeById = async (timeId: number) => {
        try {
            const result = await TimeService.getTimeById(timeId);
            setTimes((prevTimes) => [...prevTimes, result]);
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

    const handleGetAllTimes = async (schedule: any) => {
        if (schedule?.id) {
            try {
                // Gọi tất cả các API song song
                const promises = schedule.listScheduleDetails.map(
                    (detail: DoctorScheduleDetail) =>
                        getTimeById(detail.time_id)
                );
                await Promise.all(promises);
            } catch (error) {
                console.error('Error fetching times:', error);
            }
        }
    };
    useEffect(() => {
        console.log(doctor);
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);
    useEffect(() => {
        getDoctorSchedule();
    }, [date]);

    useEffect(() => {
        if (schedule?.id) {
            handleGetAllTimes(schedule);
        }
    }, [schedule]);

    return (
        <div className="container mt-4 mb-4">
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
            <div className="booking-form mt-4">
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
        </div>
    );
};

export default BookingAppointment;
