import {
    useFetchSchedulesByEntityIdAndDate,
    useUpdateScheduleStatus,
} from '../../../../hooks';
import { Button, Col, Row, Skeleton } from 'antd';
import { Schedules } from '../../../../models';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
const SchedulesComp = (props: {
    schedules: Schedules[];
    isFetching: boolean;
    error: Error | null;
    handleClickTimeButton: any;
}) => {
    return (
        <Skeleton active loading={props.isFetching}>
            <Row gutter={[24, 24]}>
                {props.error ? (
                    <p className="fw-bold text-center">
                        {props.error.message.includes('404')
                            ? 'Bác sĩ chưa có thời gian làm việc trong hôm này !'
                            : 'Lỗi không lấy được thời gian làm việc của bác sĩ !'}
                    </p>
                ) : (
                    props.schedules?.map((schedule: Schedules, index) => {
                        return (
                            <Col span={6}>
                                <Button
                                    onClick={() => {
                                        props.handleClickTimeButton(schedule);
                                    }}
                                >
                                    {schedule.startTime} - {schedule.endTime}
                                </Button>
                            </Col>
                        );
                    })
                )}
            </Row>
        </Skeleton>
    );
};

export default SchedulesComp;
