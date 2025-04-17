import { useEffect } from 'react';
import { useFetchSchedulesByEntityIdAndDate } from '../../../../hooks/schedules/useFetchSchedulesByEntityIdAndDate';
import { Button, Col, Row, Skeleton } from 'antd';
import { Schedules } from '../../../../models';

const SchedulesComp = (props: {
    entityId: number;
    date: string;
    handleClickTimeButton: any;
}) => {
    const { data, error, isFetching } = useFetchSchedulesByEntityIdAndDate({
        entityId: props.entityId,
        date: props.date,
        entityType: 'doctor',
    });
    return (
        <Skeleton active loading={isFetching}>
            <Row gutter={[24, 24]}>
                {error ? (
                    <p className="fw-bold text-center">{error.message}</p>
                ) : (
                    data?.data?.map((schedule: Schedules, index) => {
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
