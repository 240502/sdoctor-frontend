import { useState, useEffect } from 'react';
import { Time } from '../../../../models/time';
import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'antd';
import { scheduleService } from '../../../../services/scheduleService';
import socket from '../../../../socket';
import { ScheduleDetails } from '../../../../models/schedule_details';
import { schedule_detailsService } from '../../../../services/schedule_detailsService';
import { Schedule } from '../../../../models/schdule';
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
    const today = new Date();
    const stringDay = `${today.getFullYear()}-${today.getMonth() + 1}-${
        today.getDate().toString().length === 1
            ? '0' + today.getDate()
            : today.getDate()
    }`;
    const [date, setDate] = useState<string>();
    const setSchedules = useSetRecoilState(scheduleListState);
    const schedules = useRecoilValue(scheduleListValue);
    const [schedule, setSchedule] = useState<Schedule>();
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(String(dateString));
    };

    const handleOnClickBtnTime = (time: Time) => {
        setIsModalOpen(true);
        setDoctor(doctor);
        setTime(time);
        setAppointmentDate(date ?? stringDay);
    };
    const getScheduleBySubscriberIdAndDate = async (
        date: string,
        subscriberId: number
    ) => {
        try {
            const data = {
                date: date ?? stringDay,
                subscriberId: subscriberId,
                type: 'Bác sĩ',
            };
            const result = await scheduleService.getBySubscriberIdAndDate(data);
            setSchedule(result.data);

            setSchedules((prev: Schedule[]) => {
                const existingSchedule = prev.find(
                    (schedule: Schedule) =>
                        schedule.subscriber_id === subscriberId
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

            getScheduleBySubscriberIdAndDate(
                String(date ?? stringDay),
                subscriberId
            );
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        console.log('Current myArray:', schedules);
    }, [schedules]);
    useEffect(() => {
        let isDifferentDate = false;
        schedules.forEach((schedule: Schedule) => {
            if (String(schedule.date) !== date) {
                isDifferentDate = true;
                const newSchedules = schedules.filter((schedule: Schedule) => {
                    return schedule.subscriber_id !== subscriberId;
                });
                setSchedules(newSchedules);
            }
        });
        getScheduleBySubscriberIdAndDate(
            String(date ?? stringDay),
            subscriberId
        );
    }, [date, subscriberId]);

    useEffect(() => {
        socket.on('newAppointment', (newAppointment) => {
            // setNewAppointment(newAppointment);
            console.log(schedules);

            const schedule = schedules?.find(
                (schedule: Schedule, i: number) => {
                    return schedule.subscriber_id === newAppointment.doctor_id;
                }
            );
            const scheduleDetail = schedule?.listScheduleDetails.find(
                (scheduleDetail: ScheduleDetails) => {
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
                defaultValue={dayjs(stringDay, dateFormat)}
                defaultChecked={true}
                onChange={onChange}
            ></DatePicker>
            <p className="fs-6 fw-bold ms-1">
                <CalendarOutlined /> Lịch khám
            </p>
            <span className="list__time">
                {schedule ? (
                    schedule.listScheduleDetails?.map(
                        (scheduleDetail: ScheduleDetails) => {
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
