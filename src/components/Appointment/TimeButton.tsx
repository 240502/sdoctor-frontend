import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Time } from '../../models/time';
import { TimeService } from '../../services/timeService';

export const TimeButton = ({ handleClickTimeButton, timeId }: any) => {
    const [time, setTime] = useState<Time>();
    const getTimeById = async (timeId: string) => {
        try {
            const result = await TimeService.getTimeById(Number(timeId));
            setTime(result);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getTimeById(timeId);
    }, [timeId]);
    return (
        <Button
            onClick={() => {
                handleClickTimeButton(time);
            }}
        >
            {time?.value}
        </Button>
    );
};
