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

type MessageType = 'success' | 'error';
export const ListTime = ({
    activeDay,
    schedule,
    user,
    config,
    setSchedule,
    openNotification,
    handleGetScheduleBySubscriberAndDate,
    interval,
}: any) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);
    const [times, setTimes] = useState<Time[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<Time[]>([]);
    const [deleteDetails, setDeletedDetails] = useState<DoctorScheduleDetail[]>(
        []
    );
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const handleOverTime = (day: number) => {
        const now = new Date();
        if (day < now.getDay() && day !== 0) {
            setIsVisible(true);
        } else setIsVisible(false);
    };
    const getTimeByType = async () => {
        try {
            const data = { timeType: interval };
            const res = await TimeService.getTimeByTimeType(data);
            setTimes(res);
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
        console.log(schedule);
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
        updateSchedule(schedule?.id, [
            ...newDeletedDetails,
            ...newScheduleDetails,
        ]);
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
            (selectedTine: Time) => time.id === selectedTine.id
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
        setSelectedTimes(times);
    };
    const handleRemoveTime = (index: number) => {
        const updatedTimes = selectedTimes.filter(
            (_, i: number) => i !== index
        );
        setSelectedTimes(updatedTimes);
        const existDetail = schedule.listScheduleDetails.find(
            (detail: DoctorScheduleDetail) =>
                detail.time_id === selectedTimes[index].id
        );
        if (existDetail) {
            const newDeletedDetails = [...deleteDetails, existDetail];
            console.log('newDeletedDetails', newDeletedDetails);
            setDeletedDetails(newDeletedDetails);
        }
    };
    const handleRemoveAllTimes = () => {
        setSelectedTimes([]);
        const newDeletedDetails = [...schedule.listScheduleDetails];
        console.log('newDeletedDetails', newDeletedDetails);
        setDeletedDetails(newDeletedDetails);
    };
    useEffect(() => {
        if (schedule?.listScheduleDetails?.length > 0) {
            setIsUpdate(true);
            let selectedTimes: Time[] = [];
            schedule?.listScheduleDetails?.forEach(
                (detail: DoctorScheduleDetail) => {
                    const time: Time = {
                        id: detail.time_id,
                        start_time: detail.start_time,
                        end_time: detail.end_time,
                        interval: null,
                        disable: null,
                    };
                    if (selectedTimes.length > 0) {
                        selectedTimes.push(time);
                    } else {
                        selectedTimes = [time];
                    }
                }
            );
            setSelectedTimes(selectedTimes);
        }
    }, [schedule]);

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
                        const existTime = selectedTimes.find(
                            (selectedTine: Time) => time.id === selectedTine.id
                        );
                        return (
                            <Col span={6} className="time-item" key={time?.id}>
                                <Button
                                    key={time?.id}
                                    onClick={() => handleAddTime(time)}
                                    className=""
                                    type={existTime ? 'primary' : 'default'}
                                >
                                    {time.start_time}
                                    <PlusOutlined />
                                </Button>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
            <Col span={12} className="selected-time">
                <h6 className="mb-3">Thời gian đã chọn</h6>
                <Row
                    gutter={[24, 24]}
                    className="border border-top-0 border-start-0 border-end-0 pb-2"
                >
                    {selectedTimes.map((time: Time, index: number) => {
                        return (
                            <Col
                                span={6}
                                className="select-time"
                                key={time?.id}
                            >
                                <Button
                                    key={time?.id}
                                    className=""
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
                    })}
                </Row>
                <Row gutter={24} className="p-3 justify-content-between">
                    <Button
                        className="bg-dark text-light"
                        onClick={() => {
                            if (isUpdate) {
                                handleUpdateSchedule();
                            } else {
                                //handleCreateSchedule()
                            }
                        }}
                    >
                        Lưu
                    </Button>
                    <Button
                        className="border-danger text-danger"
                        onClick={handleRemoveAllTimes}
                    >
                        Xóa tất cả <CloseOutlined></CloseOutlined>
                    </Button>
                </Row>
            </Col>
        </Row>
    );
};
