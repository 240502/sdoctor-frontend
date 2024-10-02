import React, { useState, useEffect } from 'react';
import { Time } from '../../../models/time';
import { TimeService } from '../../../services/timeService';
import { Button } from 'antd';
export const ListTime = ({
    id,
    setIsModalOpen,
    setDoctor,
}: any): JSX.Element => {
    const [time, setTime] = useState<Time>();
    useEffect(() => {
        const getTimeById = async (id: any) => {
            try {
                const data: Time = await TimeService.getTimeById(id);
                setTime(data);
            } catch (err: any) {
                console.log(err.message);
            }
        };

        getTimeById(id);
    }, [id]);
    return (
        <Button
            key={Number(time?.id)}
            className="me-3 mb-3"
            onClick={() => {
                setIsModalOpen(true);
            }}
        >
            {time?.value}
        </Button>
    );
};
