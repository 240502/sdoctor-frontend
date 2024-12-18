import { useEffect, useState } from 'react';
import { Button, Row, Col, message } from 'antd';
import { TimeService } from '../../../../services/timeService';
import { useRecoilState } from 'recoil';
import { scheduleDetailsState } from '../../../../stores/scheduleDetailAtom';
import { Time } from '../../../../models/time';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { handleGetDateByActiveDay } from '../../../../utils/schedule_management';
import { scheduleService } from '../../../../services/doctorScheduleService';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
import { handleTimeOverRealTime } from '../../../../utils/schedule';

type MessageType = 'success' | 'error' | 'warning';
export const ListTime = ({
    activeDay,
    schedule,
    user,
    config,
    setSchedule,
    openNotification,
    handleGetScheduleBySubscriberAndDate,
    interval,
    selectedTimes,
    setSelectedTimes,
}: any) => {
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);
    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);
    const [times, setTimes] = useState<Time[]>([]);
    const [deleteDetails, setDeletedDetails] = useState<DoctorScheduleDetail[]>(
        []
    );
    const [messageApi, contextHolder] = message.useMessage();
    const handleOverTime = (day: number) => {
        const now = new Date();
        if (day < now.getDay() && day !== 0) {
            setDisableSaveButton(true);
        } else setDisableSaveButton(false);
    };
    const getTimeByType = async () => {
        try {
            const data = { timeType: interval };
            const res = await TimeService.getTimeByTimeType(data);
            const now = new Date();
            if (activeDay === now.getDay()) {
                const newTimes = handleTimeOverRealTime(res);
                setTimes(newTimes);
            }
            if (activeDay !== 0 && activeDay < now.getDay()) {
                const newTimes = res.map((time: Time) => {
                    return { ...time, disable: true };
                });
                setTimes(newTimes);
            }
            if (activeDay === 0 || activeDay > now.getDay()) {
                setTimes(res);
            }
            console.log('times', res);
        } catch (err: any) {
            console.log(err.message);
            setTimes([]);
        }
    };
    const handleCreateSchedule = () => {
        const now = new Date();
        let dateOfWeek;
        if (now.getDay() === Number(activeDay)) {
            dateOfWeek = now;
        } else {
            dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
        }
        let newDoctorScheduleDetail: DoctorScheduleDetail[] =
            [] as DoctorScheduleDetail[];
        selectedTimes.forEach((time: Time) => {
            const detail: DoctorScheduleDetail = {
                id: 0,
                time_id: time.id,
                schedule_id: null,
                available: 1,
                action: 1,
                start_time: null,
                end_time: null,
            };
            if (newDoctorScheduleDetail.length > 0) {
                newDoctorScheduleDetail.push(detail);
            } else {
                newDoctorScheduleDetail = [detail];
            }
        });
        const schedule = {
            doctor_id: user.doctor_id,
            date: `${dateOfWeek.getFullYear()}-${
                dateOfWeek.getMonth() + 1
            }-${dateOfWeek.getDate()}`,
            listScheduleDetails: newDoctorScheduleDetail,
        };
        CreateSchedule(schedule);
    };
    const CreateSchedule = async (data: any) => {
        try {
            const res = await scheduleService.createSchedule(data, config);
            setSchedule(res?.data.result);
            setDoctorScheduleDetails(res?.data?.result.listScheduleDetails);
            openNotification(
                'success',
                'Thông báo !',
                'Đăng ký lịch thành công'
            );
            handleGetScheduleBySubscriberAndDate();
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                'error',
                'Thông báo !',
                'Đăng ký lịch không thành công'
            );
        }
    };

    const openMessage = (type: MessageType, message: string) => {
        messageApi.open({ type: type, content: message });
    };
    const handleUpdateSchedule = () => {
        let newTimes = [];
        if (selectedTimes.length >= schedule.listScheduleDetails?.length) {
            newTimes = selectedTimes.filter((time: Time) => {
                const exist = schedule.listScheduleDetails.find(
                    (detail: DoctorScheduleDetail) => {
                        return detail.time_id === time.id;
                    }
                );
                if (!exist) {
                    return time;
                }
            });
        } else {
            newTimes = selectedTimes.filter((time: Time) => {
                const exist = schedule.listScheduleDetails.find(
                    (detail: DoctorScheduleDetail) => {
                        return detail.time_id === time.id;
                    }
                );
                if (!exist) {
                    return time;
                }
            });
        }
        let newScheduleDetails: DoctorScheduleDetail[] = [];
        let newDeletedDetails: DoctorScheduleDetail[] = [];
        if (newTimes.length > 0) {
            newTimes.forEach((time: Time) => {
                const newScheduleDetail: DoctorScheduleDetail = {
                    id: null,
                    schedule_id: schedule?.id,
                    start_time: time.start_time,
                    end_time: time.end_time,
                    available: 1,
                    action: 1,
                    time_id: time?.id,
                };
                newScheduleDetails.push(newScheduleDetail);
            });
        }
        if (deleteDetails.length > 0) {
            newDeletedDetails = deleteDetails.map(
                (detail: DoctorScheduleDetail) => {
                    return { ...detail, action: 3 };
                }
            );
        }
        if (newDeletedDetails?.length > 0 || newScheduleDetails?.length > 0) {
            updateSchedule(schedule?.id, [
                ...newDeletedDetails,
                ...newScheduleDetails,
            ]);
        } else {
            console.log('no update');
            openMessage('warning', 'Không có gì thay đổi !');
        }
    };
    const updateSchedule = async (
        id: number,
        scheduleDetails: DoctorScheduleDetail[]
    ) => {
        try {
            const data = {
                id: id,
                scheduleDetails: scheduleDetails,
            };

            const res = await scheduleService.updateSchedule(data, config);
            handleGetScheduleBySubscriberAndDate();
            openNotification(
                'success',
                'Thông báo !',
                'Cập nhập thời gian thành công!'
            );
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                'error',
                'Thông báo !',
                'Cập nhập thời gian không thành công!'
            );
        }
    };
    const handleAddTime = (time: Time) => {
        const existTime = selectedTimes.find(
            (selectedTime: Time) =>
                time.id === selectedTime.id ||
                selectedTime.start_time === time.start_time
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
                            timeA?.start_time?.split(':')[0]
                        );
                        const startHourTimeB = Number(
                            timeB?.start_time?.split(':')[0]
                        );
                        const startMinuteTimeA = Number(
                            timeA?.start_time?.split(':')[1]
                        );
                        const startMinuteTimeB = Number(
                            timeB?.start_time?.split(':')[1]
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
    const handleSelectAllTime = () => {
        if (selectedTimes.length > 0) {
            const notAddedTimes = times.filter(
                (time: Time) => !selectedTimes.includes(time)
            );
            setSelectedTimes([...selectedTimes, ...notAddedTimes]);
        } else {
            setSelectedTimes([...times]);
        }
    };
    const handleRemoveTime = (index: number) => {
        const updatedTimes = selectedTimes.filter(
            (time: Time, i: number) => i !== index
        );
        setSelectedTimes(updatedTimes);
        const existDetail = schedule.listScheduleDetails.find(
            (detail: DoctorScheduleDetail) =>
                detail.time_id === selectedTimes[index].id
        );
        if (existDetail) {
            const newDeletedDetails = [...deleteDetails, existDetail];
            setDeletedDetails(newDeletedDetails);
        }
    };
    const handleRemoveAllTimes = () => {
        setSelectedTimes([]);
        const newDeletedDetails = [...schedule.listScheduleDetails];
        setDeletedDetails(newDeletedDetails);
    };

    useEffect(() => {
        console.log('selected times', selectedTimes);
    }, [selectedTimes]);
    useEffect(() => {
        handleOverTime(activeDay);
        getTimeByType();
    }, [activeDay, interval]);

    return (
        <Row gutter={[24, 24]} className="time-slots">
            {contextHolder}
            <Col
                span={12}
                className="border border-start-0 border-bottom-0 pe-3 border-top-0 "
            >
                <h6 className="mb-3">Chọn thời gian làm việc cho hôm nay</h6>
                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <Button onClick={() => handleSelectAllTime()}>
                            Chọn tất cả
                            <PlusOutlined />
                        </Button>
                    </Col>
                    {times.map((time: Time) => {
                        if (selectedTimes?.length > 0) {
                            const existTime = selectedTimes?.find(
                                (selectedTine: Time) =>
                                    time?.id === selectedTine?.id
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
                                        onClick={() => handleAddTime(time)}
                                        type={existTime ? 'primary' : 'default'}
                                    >
                                        {time.start_time}
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
                                        onClick={() => handleAddTime(time)}
                                        type={'default'}
                                    >
                                        {time.start_time}
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
                    {selectedTimes?.length > 0 ? (
                        selectedTimes?.map((time: Time, index: number) => {
                            return (
                                <Col
                                    span={6}
                                    className="select-time"
                                    key={time?.id}
                                >
                                    <Button
                                        key={time?.id}
                                        className={`${
                                            time?.disable ? 'pe-none' : ''
                                        }`}
                                        type="primary"
                                        onClick={() => {
                                            handleRemoveTime(index);
                                        }}
                                    >
                                        {time.start_time}
                                        <CloseOutlined />
                                    </Button>
                                </Col>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </Row>
                <Row gutter={24} className="p-3 justify-content-between">
                    <Button
                        className={`bg-dark text-light `}
                        disabled={selectedTimes?.length > 0 ? false : true}
                        onClick={() => {
                            if (schedule?.listScheduleDetails?.length > 0) {
                                handleUpdateSchedule();
                            } else {
                                handleCreateSchedule();
                            }
                        }}
                    >
                        Lưu
                    </Button>
                    <Button
                        className={`border-danger text-danger `}
                        disabled={disableSaveButton}
                        onClick={handleRemoveAllTimes}
                    >
                        Xóa tất cả <CloseOutlined></CloseOutlined>
                    </Button>
                </Row>
            </Col>
        </Row>
    );
};
