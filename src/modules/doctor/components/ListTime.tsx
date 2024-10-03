import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { TimeService } from '../../../services/timeService';
import { Time } from '../../../models/time';
export const ListTime = ({ handleOnClickBtnTime, timeId }: any) => {
    const [time, setTime] = useState<Time>();
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
    }, []);
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
