import { useState, useEffect } from 'react';
import { Time } from '../../../../models/time';
import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'antd';
import { scheduleService } from '../../../../services/doctorScheduleService';
import socket from '../../../../socket';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
import { schedule_detailsService } from '../../../../services/doctorScheduleDetailService';
import { DoctorSchedule } from '../../../../models/doctorSchedule';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ListTime } from './ListTime';
import {
    scheduleListState,
    scheduleListValue,
} from '../../../../stores/scheduleAtom';
export const BlockSchedule = ({
    subscriberId,
    setIsModalOpen,
    doctor,
    setDoctor,
    setTime,
    setAppointmentDate,
}: any): JSX.Element => {
    const dateFormat = 'YYYY-MM-DD';

    const [date, setDate] = useState<string>();
    const setSchedules = useSetRecoilState(scheduleListState);
    const schedules = useRecoilValue(scheduleListValue);
    const [schedule, setSchedule] = useState<DoctorSchedule>();
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(String(dateString));
    };

    const handleOnClickBtnTime = (time: Time) => {
        setIsModalOpen(true);
        setDoctor(doctor);
        setTime(time);
        setAppointmentDate(date);
    };
    const getScheduleBySubscriberIdAndDate = async (
        date: string,
        subscriberId: number
    ) => {
        try {
            const data = {
                date: date,
                subscriberId: subscriberId,
            };
            const result = await scheduleService.viewScheduleForClient(data);
            setSchedule(result.data);

            setSchedules((prev: DoctorSchedule[]) => {
                const existingSchedule = prev.find(
                    (schedule: DoctorSchedule) =>
                        schedule.doctor_id === subscriberId
                );
                if (existingSchedule) {
                    return prev;
                } else {
                    return [...prev, result.data];
                }
            });
        } catch (err: any) {
            console.log(err.message);
            setSchedule(undefined);
        }
    };

    const updateAvailableScheduleDetail = async (scheduleDetailId: number) => {
        try {
            const res =
                await schedule_detailsService.updateAvailableScheduleDetail(
                    scheduleDetailId
                );

            getScheduleBySubscriberIdAndDate(String(date), subscriberId);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);

    useEffect(() => {
        let isDifferentDate = false;
        schedules.forEach((schedule: DoctorSchedule) => {
            if (String(schedule.date) !== date) {
                isDifferentDate = true;
                const newSchedules = schedules.filter(
                    (schedule: DoctorSchedule) => {
                        return schedule.doctor_id !== subscriberId;
                    }
                );
                setSchedules(newSchedules);
            }
        });
        getScheduleBySubscriberIdAndDate(String(date), subscriberId);
    }, [date, subscriberId]);

    useEffect(() => {
        socket.on('newAppointment', (newAppointment) => {
            // setNewAppointment(newAppointment);

            const schedule = schedules?.find(
                (schedule: DoctorSchedule, i: number) => {
                    return schedule.doctor_id === newAppointment.doctor_id;
                }
            );
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
    }, [schedules]);
    return (
        <div className="block__schedule">
            <DatePicker
                className="mb-3"
                defaultValue={dayjs(date, dateFormat)}
                defaultChecked={true}
                onChange={onChange}
            ></DatePicker>
            <p className="fs-6 fw-bold ms-1">
                <CalendarOutlined /> Lịch khám
            </p>
            <span className="list__time">
                {schedule ? (
                    schedule.listScheduleDetails?.map(
                        (scheduleDetail: DoctorScheduleDetail) => {
                            return (
                                <ListTime
                                    date={date}
                                    handleOnClickBtnTime={handleOnClickBtnTime}
                                    timeId={scheduleDetail.time_id}
                                    updateAvailableScheduleDetail={
                                        updateAvailableScheduleDetail
                                    }
                                    scheduleDetailId={scheduleDetail.id}
                                />
                            );
                        }
                    )
                ) : (
                    <p className="fs-6 ms-1 fw-bold">Không có lịch làm việc</p>
                )}
            </span>

            <p className="ms-1">Chọn và đặt (Phí đặt lịch 0đ)</p>
        </div>
    );
};
