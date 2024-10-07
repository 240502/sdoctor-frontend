import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { TimeService } from '../../../services/timeService';
import { Time } from '../../../models/time';

export const ListTime = ({
    handleOnClickBtnTime,
    timeId,
    updateAvailableScheduleDetail,
    scheduleDetailId,
}: any) => {
    const [time, setTime] = useState<Time>();
    // const handleTimeOverRealTime = (startHour: number, startMinute: number) => {
    //     const intervalId = setInterval(() => {
    //         console.log('chay');
    //         const now = new Date();
    //         const hours = String(now.getHours()).padStart(2, '0');
    //         const minutes = String(now.getMinutes()).padStart(2, '0');
    //         if (Number(startHour) === Number(hours)) {
    //             if (Number(startMinute) <= Number(minutes)) {
    //                 console.log('update');
    //                 updateAvailableScheduleDetail(scheduleDetailId);
    //             }
    //         }
    //         if (Number(startHour) < Number(hours)) {
    //             console.log('update');
    //             updateAvailableScheduleDetail(scheduleDetailId);
    //         }
    //     }, 1000);
    //     return intervalId;
    // };
    const getTimeById = async (timeId: string) => {
        try {
            const result = await TimeService.getTimeById(timeId);
            setTime(result);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getTimeById(timeId);
    }, [timeId]);
    useEffect(() => {
        let intervalId: number;
        if (time) {
            const listTime: any = time?.value.split('-');
            const startMinute = listTime[0].split('.')[1];
            const startHour = listTime[0].split('.')[0];
            // intervalId = handleTimeOverRealTime(startHour, startMinute);
        }

        return () => {
            clearInterval(intervalId);
            console.log('clear:' + intervalId);
        };
    }, [time]);
    return (
        <Button
            key={Number(time?.id)}
            className="me-3 mb-3"
            onClick={() => {
                handleOnClickBtnTime(time);
            }}
        >
            {time?.value}
        </Button>
    );
};
