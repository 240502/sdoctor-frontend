import React, { useEffect, useState } from 'react';
import { Time } from '../../../../models/time';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TimeService } from '../../../../services/timeService';

export const ListTime = ({
    timeType,
    day,
    selectedTimes,
    setSelectedTimes,
    selectedTimeKeys,
    setSelectedTimeKeys,
}: any) => {
    const [times, setTimes] = useState<Time[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const getTimeByType = async (type: string) => {
        try {
            const data = { timeType: type };
            const res = await TimeService.getTimeByTimeType(data);
            setTimes(res);
        } catch (err: any) {
            console.log(err);
        }
    };
    const handleOverTime = (day: number) => {
        const now = new Date();
        if (day < now.getDay()) {
            setIsVisible(true);
        }
    };

    useEffect(() => {
        getTimeByType(timeType);
        handleOverTime(day);
    }, [timeType]);
    useEffect(() => {
        if (selectedTimeKeys.length > 0) {
            const newSelectedTimes = times.filter((time: Time) => {
                const isExist = selectedTimeKeys.includes(time.id);
                if (isExist) {
                    return time;
                }
            });
            setSelectedTimes(newSelectedTimes);
        }
    }, [selectedTimeKeys]);
    const handleSelectTime = (time: Time) => {
        if (selectedTimes.length > 0) {
            const existsTime = selectedTimes.find(
                (selectedTime: Time) => selectedTime.id === time.id
            );

            if (existsTime) {
                const newListSelectedTime = selectedTimes.filter(
                    (selectedTime: Time) => selectedTime.id !== time.id
                );
                setSelectedTimes(newListSelectedTime);
            } else {
                const newList = [...selectedTimes, time];
                newList.sort((firstTime: Time, secondTime: Time) => {
                    return Number(firstTime.id) - Number(secondTime.id);
                });
                setSelectedTimes(newList);
            }
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };
    const handleSelectedKeys = (timeKey: number) => {
        if (selectedTimeKeys.length > 0) {
            const existsKey = selectedTimeKeys.find(
                (key: any) => key === timeKey
            );

            if (existsKey) {
                const newListSelectedTimeKeys: any = selectedTimeKeys.filter(
                    (key: any) => key !== timeKey
                );
                setSelectedTimeKeys(newListSelectedTimeKeys);
            } else {
                const newList: any = [...selectedTimeKeys, timeKey];

                setSelectedTimeKeys(newList);
            }
        } else {
            setSelectedTimeKeys([...selectedTimeKeys, timeKey]);
        }
    };

    return (
        <div className="d-flex mt-3 border rounded p-3">
            <div className="block__select__time col-6 border border-top-0 border-start-0 border-bottom-0">
                <h6>Chọn thời gian</h6>
                <div className="time__list">
                    {times.map((time: Time) => {
                        return (
                            <Button
                                disabled={isVisible ? true : false}
                                className={`me-3 mt-3 border border-primary ${
                                    selectedTimeKeys.includes(Number(time.id))
                                        ? 'bg-primary text-white'
                                        : 'text-dark'
                                }`}
                                key={time.id}
                                onClick={() => {
                                    handleSelectTime(time);
                                    handleSelectedKeys(time.id);
                                }}
                            >
                                {time.value}
                                <PlusOutlined />
                            </Button>
                        );
                    })}
                </div>
            </div>
            <div className="block__selected__time col-6 ps-3">
                <h6>Thời gian đã chọn </h6>
                <div className="time__list">
                    {selectedTimes &&
                        selectedTimes.map((time: Time) => {
                            return (
                                <Button
                                    className="me-3 mt-3 pe-none bg-primary text-white"
                                    key={time.id}
                                >
                                    {time.value}
                                    <PlusOutlined />
                                </Button>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
