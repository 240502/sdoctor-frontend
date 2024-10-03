import { useState, useEffect } from 'react';
import { Time } from '../../../models/time';
import { Button, DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'antd';
import { Schedule } from '../../../models/schdule';
import { ListTime } from './ListTime';
import { scheduleService } from '../../../services/scheduleService';
import { AsyncCompiler } from 'sass';
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
    const [schedule, setSchedule] = useState<Schedule>();
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(dateString);
        setDate(String(dateString));
    };
    const getScheduleBySubscriberIdAndDate = async (
        date: string,
        subscriberId: number
    ) => {
        try {
            const data = {
                date: date ?? stringDay,
                subscriberId: subscriberId,
            };
            const result = await scheduleService.getBySubscriberIdAndDate(data);
            setSchedule(result.data);
        } catch (err: any) {
            console.log(err.message);
            setSchedule(undefined);
        }
    };
    useEffect(() => {
        getScheduleBySubscriberIdAndDate(
            String(date ?? stringDay),
            subscriberId
        );
    }, [date]);
    const handleOnClickBtnTime = (time: Time) => {
        setIsModalOpen(true);
        setDoctor(doctor);
        setTime(time);
        setAppointmentDate(date ?? stringDay);
    };
    return (
        <div className="block__schedule border border-end-0 border-start-0 border-top-0">
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
                    schedule?.time.map((time: string) => {
                        return (
                            <ListTime
                                handleOnClickBtnTime={handleOnClickBtnTime}
                                timeId={time}
                            />
                        );
                    })
                ) : (
                    <p className="fs-6 ms-1 fw-bold">Không có lịch làm việc</p>
                )}
            </span>
            <p className="ms-1">Chọn và đặt (Phí đặt lịch 0đ)</p>
        </div>
    );
};
