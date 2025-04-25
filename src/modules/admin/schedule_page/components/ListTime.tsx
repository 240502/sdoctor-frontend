import { useEffect, useState } from 'react';
import { Button, Row, Col, Skeleton } from 'antd';
import { Time } from '../../../../models/time';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { handleGetDateByActiveDay } from '../../../../utils/schedule_management';
import { Schedules, SchedulesCreate } from '../../../../models';
import {
    useCreateSchedules,
    useDeleteSchedules,
} from '../../../../hooks/schedules';
import dayjs from 'dayjs';
import {
    useUpdateSchedules,
    UseUpdateSchedulesReturn,
} from '../../../../hooks/schedules/useUpdateSchedules';
export const ListTime = ({
    activeDay,
    user,
    config,
    openMessage,
    interval,
    selectedTimes,
    setSelectedTimes,
    isFetchingSchedules,
    times,
    isFetchingTime,
    schedules,
    refetch,
}: any) => {
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const handleOverTime = (day: number) => {
        if (day < dayjs().day() && day !== 0) {
            setDisableSaveButton(true);
        } else setDisableSaveButton(false);
    };

    useEffect(() => {
        handleOverTime(activeDay);
        console.log('Times', times);
    }, []);

    const createSchedules = useCreateSchedules(config);
    const handleCreateSchedule = () => {
        const now = dayjs();
        let dateOfWeek: string = now.format('YYYY-MM-DD');
        if (now.day() !== Number(activeDay)) {
            dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
        }
        let schedules: SchedulesCreate[] = [];
        selectedTimes.forEach((time: Time) => {
            const schedule: SchedulesCreate = {
                entityId: user.userId,
                date: dateOfWeek,
                entityType: 'Doctor',
                timeId: time.id,
            };
            schedules.push(schedule);
        });
        createSchedules.mutate(schedules, {
            onSuccess(data) {
                console.log('created schedules successfully', data);
                openMessage('success', 'Thêm lịch làm việc thành công!');
                refetch();
            },
            onError(error) {
                console.log('Created schedules error', error);
                openMessage('error', 'Thêm lịch làm việc không thành công!');
            },
        });
    };
    const {
        updateSchedules,
        isPending,
        isError,
        error,
    }: UseUpdateSchedulesReturn = useUpdateSchedules(config);
    const handleUpdateSchedules = async () => {
        try {
            const now = dayjs();
            let dateOfWeek: string = now.format('YYYY-MM-DD');
            if (now.day() !== Number(activeDay)) {
                dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
            }
            const schedulesToCreate: SchedulesCreate[] = selectedTimes
                .filter(
                    (time: Time) =>
                        !schedules.some(
                            (schedule: Schedules) => schedule.timeId === time.id
                        )
                )
                .map((time: Time) => ({
                    entityId: user.userId,
                    date: dateOfWeek,
                    entityType: 'Doctor',
                    timeId: time.id,
                }));
            await updateSchedules(deletedIds, schedulesToCreate);
            openMessage('success', 'Cập nhập thành công !');
        } catch (err: any) {
            openMessage('error', 'Cập nhập không thành công !');
        }
    };
    const handleSubmit = async () => {
        console.log(schedules && schedules?.length > 0);

        if (schedules && schedules?.length > 0) {
            handleUpdateSchedules();
        } else {
            handleCreateSchedule();
        }
    };
    const handleAddTime = (time: Time) => {
        const existTime = selectedTimes.find(
            (selectedTime: Time) =>
                time.id === selectedTime.id ||
                selectedTime.startTime === time.startTime
        );
        if (existTime) {
            openMessage(
                'error',
                'Thời gian này đã được chọn! Vui lòng chọn thời gian khác'
            );
        } else {
            if (selectedTimes.length > 0) {
                const newSelectTimes = [...selectedTimes, time];
                const sortedTimes = newSelectTimes.sort(
                    (timeA: Time, timeB: Time) => {
                        const startHourTimeA = Number(
                            timeA?.startTime?.split(':')[0]
                        );
                        const startHourTimeB = Number(
                            timeB?.startTime?.split(':')[0]
                        );
                        const startMinuteTimeA = Number(
                            timeA?.startTime?.split(':')[1]
                        );
                        const startMinuteTimeB = Number(
                            timeB?.startTime?.split(':')[1]
                        );
                        return (
                            startHourTimeA - startHourTimeB ||
                            startMinuteTimeA - startMinuteTimeB
                        );
                    }
                );
                setSelectedTimes(sortedTimes);
            } else {
                setSelectedTimes([time]);
            }
        }
    };
    // const handleSelectAllTime = () => {
    //     if (selectedTimes.length > 0) {
    //         const notAddedTimes = times.filter(
    //             (time: Time) => !selectedTimes.includes(time)
    //         );
    //         setSelectedTimes([...selectedTimes, ...notAddedTimes]);
    //     } else {
    //         setSelectedTimes([...times]);
    //     }
    // };
    const handleRemoveTime = (index: number) => {
        const updatedTimes = selectedTimes.filter(
            (time: Time, i: number) => i !== index
        );
        setSelectedTimes(updatedTimes);
        const existsSchedule = schedules.find(
            (schedule: Schedules) => schedule.timeId === selectedTimes[index].id
        );
        if (existsSchedule) {
            setDeletedIds([...deletedIds, existsSchedule.id]);
        }
    };
    useEffect(() => {
        console.log('deletedIds', deletedIds);
    }, [deletedIds]);
    // const handleRemoveAllTimes = () => {
    //     setSelectedTimes([]);
    //     const newDeletedDetails = [...schedule.listScheduleDetails];
    //     setDeletedDetails(newDeletedDetails);
    // };
    useEffect(() => {
        handleOverTime(activeDay);
    }, [activeDay, interval]);

    return (
        <Row gutter={[24, 24]} className="time-slots">
            <Col
                span={12}
                className="border border-start-0 border-bottom-0 pe-3 border-top-0 "
            >
                <h6 className="mb-3">Chọn thời gian làm việc cho hôm nay</h6>
                <Row gutter={[24, 24]}>
                    {isFetchingTime
                        ? Array(3)
                              .fill(null)
                              .map((_, index) => (
                                  <Col span={24} key={index}>
                                      <Skeleton
                                          active
                                          style={{ width: '100%' }}
                                      />
                                  </Col>
                              ))
                        : times.map((time: Time) => {
                              if (selectedTimes?.length > 0) {
                                  const existTime = selectedTimes?.find(
                                      (selectedTime: Time) =>
                                          time?.id === selectedTime?.id
                                  );
                                  return (
                                      <Col
                                          span={6}
                                          className="time-item"
                                          key={time?.id}
                                      >
                                          <Button
                                              className={`${
                                                  time?.disable ? 'pe-none' : ''
                                              }`}
                                              key={time?.id}
                                              onClick={() =>
                                                  handleAddTime(time)
                                              }
                                              type={
                                                  existTime
                                                      ? 'primary'
                                                      : 'default'
                                              }
                                          >
                                              {time.startTime}
                                              <PlusOutlined />
                                          </Button>
                                      </Col>
                                  );
                              } else {
                                  return (
                                      <Col
                                          span={6}
                                          className="time-item"
                                          key={time?.id}
                                      >
                                          <Button
                                              className={`${
                                                  time?.disable ? 'pe-none' : ''
                                              }`}
                                              key={time?.id}
                                              onClick={() =>
                                                  handleAddTime(time)
                                              }
                                              type={'default'}
                                          >
                                              {time?.startTime}
                                              <PlusOutlined />
                                          </Button>
                                      </Col>
                                  );
                              }
                          })}
                </Row>
            </Col>
            <Col span={12} className="selected-time">
                <h6 className="mb-3">Thời gian đã chọn</h6>
                <Row
                    gutter={[24, 24]}
                    className="border border-top-0 border-start-0 border-end-0 pb-2"
                >
                    {isFetchingTime ? (
                        Array(3)
                            .fill(null)
                            .map((_, index) => (
                                <Col span={24} key={index}>
                                    <Skeleton
                                        active
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            ))
                    ) : selectedTimes?.length > 0 ? (
                        selectedTimes.map((time: Time, index: number) => (
                            <Col span={6} className="select-time" key={time.id}>
                                <Button
                                    key={time.id}
                                    className={`${
                                        time.disable ? 'pe-none' : ''
                                    }`}
                                    type="primary"
                                    onClick={() => handleRemoveTime(index)}
                                >
                                    {time.startTime}
                                    <CloseOutlined />
                                </Button>
                            </Col>
                        ))
                    ) : (
                        <></>
                    )}
                </Row>

                <Row gutter={24} className="p-3 justify-content-between">
                    <Button
                        className={`bg-dark text-light `}
                        disabled={disableSaveButton}
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        {isPending ? 'Đang cập nhập ...' : 'Lưu'}
                    </Button>
                    <Button
                        className={`border-danger text-danger `}
                        disabled={disableSaveButton}
                        // onClick={handleRemoveAllTimes}
                    >
                        Xóa tất cả <CloseOutlined></CloseOutlined>
                    </Button>
                </Row>
            </Col>
        </Row>
    );
};
