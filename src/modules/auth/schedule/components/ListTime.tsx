import { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import { TimeService } from '../../../../services/timeService';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
import { useRecoilState } from 'recoil';
import { scheduleDetailsState } from '../../../../stores/scheduleDetailAtom';

export const ListTime = ({ activeDay, schedule }: any) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);
    const handleOverTime = (day: number) => {
        const now = new Date();
        if (day < now.getDay() && day !== 0) {
            setIsVisible(true);
        } else setIsVisible(false);
    };

    // const handleTimeOverRealTime = (times: any) => {
    //     const now = new Date();
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');
    //     let newTimes: any = [];
    //     newTimes = times.map((time: Time) => {
    //         const listTime: any = time?.value.split('-');
    //         const startMinute = listTime[0].split('.')[1];

    //         const startHour = listTime[0].split('.')[0];
    //         if (Number(hours) === Number(startHour)) {
    //             if (Number(startMinute) - Number(minutes) <= 15) {
    //                 return { ...time, disable: true };
    //             } else {
    //                 return { ...time, disable: false };
    //             }
    //         }
    //         if (Number(hours) > Number(startHour)) {
    //             return { ...time, disable: true };
    //         }
    //         if (Number(hours) < Number(startHour)) {
    //             return { ...time, disable: false };
    //         }
    //     });
    //     //setTimes(newTimes);
    // };
    useEffect(() => {
        handleOverTime(activeDay);
    }, [activeDay]);

    // const handleSelectTimeAvailable = (time: Time) => {
    //     if (selectedTimes.length > 0) {
    //         const existsTime = selectedTimes.find(
    //             (selectedTime: Time) => selectedTime.id === time.id
    //         );

    //         if (existsTime) {
    //             const newListSelectedTime = selectedTimes.filter(
    //                 (selectedTime: Time) => selectedTime.id !== time.id
    //             );
    //             setSelectedTimes(newListSelectedTime);
    //         } else {
    //             const newList = [...selectedTimes, time];
    //             newList.sort((firstTime: Time, secondTime: Time) => {
    //                 return Number(firstTime.id) - Number(secondTime.id);
    //             });
    //             setSelectedTimes(newList);
    //         }
    //     } else {
    //         setSelectedTimes([...selectedTimes, time]);
    //     }
    // };
    // const handleSelectedKeys = (timeKey: number) => {
    //     if (selectedTimeKeys.length > 0) {
    //         const existsKey = selectedTimeKeys.find(
    //             (key: any) => key === timeKey
    //         );

    //         if (existsKey) {
    //             const newListSelectedTimeKeys: any = selectedTimeKeys.filter(
    //                 (key: any) => key !== timeKey
    //             );
    //             setSelectedTimeKeys(newListSelectedTimeKeys);
    //         } else {
    //             const newList: any = [...selectedTimeKeys, timeKey];
    //             setSelectedTimeKeys(newList);
    //         }
    //     } else {
    //         setSelectedTimeKeys([...selectedTimeKeys, timeKey]);
    //     }
    // };

    return (
        <Row gutter={[24, 24]} className="time-slots">
            {doctorScheduleDetails.map((detail: DoctorScheduleDetail) => {
                return (
                    <Col span={3} className="time-item">
                        <Button className="border-0 ">
                            {detail.start_time}-{detail.end_time}
                        </Button>
                    </Col>
                );
            })}
        </Row>
    );
};
