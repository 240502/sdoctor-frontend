import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Select, TabsProps, notification } from 'antd';
import { useEffect, useState } from 'react';
import { ListTime } from '../components/ListTime';
import { ScheduleDetails } from '../../../../models/schedule_details';
import { Time } from '../../../../models/time';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import { scheduleService } from '../../../../services/scheduleService';
import { Schedule } from '../../../../models/schedule';
import { handleGetDateByActiveDay } from '../../../../utils/schedule_management';
type NotificationType = 'success' | 'error';
const tabs: TabsProps['items'] = [
    {
        key: '1',
        label: <h6 className="m-0">Thứ hai</h6>,
    },
    {
        key: '2',
        label: <h6 className="m-0">Thứ ba</h6>,
    },
    {
        key: '3',
        label: <h6 className="m-0">Thứ tư</h6>,
    },
    {
        key: '4',
        label: <h6 className="m-0">Thứ năm</h6>,
    },
    {
        key: '5',
        label: <h6 className="m-0">Thứ sáu</h6>,
    },
    {
        key: '6',
        label: <h6 className="m-0">Thứ bảy</h6>,
    },
    {
        key: '0',
        label: <h6 className="m-0">Chủ nhật</h6>,
    },
];
const ScheduleManagement = () => {
    const user = useRecoilValue(userValue);
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [timeType, setTimeType] = useState<string>('60 phút');
    const [activeDay, setActiveDay] = useState<string>('1');
    const [selectedTimes, setSelectedTimes] = useState<Time[]>([]);
    const [selectedTimeKeys, setSelectedTimeKeys] = useState<number[]>([]);
    const [schedule, setSchedule] = useState<Schedule>({} as Schedule);
    const [isVisibleButtonSave, setIsVisibleButtonSave] =
        useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const openNotification = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };

    const handleGetScheduleBySubscriberAndDate = () => {
        const dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
        const data = {
            subscriberId: user.object_id,
            date: `${dateOfWeek.getFullYear()}-${
                dateOfWeek.getMonth() + 1
            }-${dateOfWeek.getDate()}`,
            type: user.role_id === 2 ? 'Bác sĩ' : 'Gói khám',
        };

        GetScheduleBySubscriberIdAndDate(data);
    };
    const GetScheduleBySubscriberIdAndDate = async (data: any) => {
        try {
            const res = await scheduleService.viewScheduleForDoctor(data);
            console.log('call api');
            setSchedule(res.data);
            let timeAvailable: any = [];
            res.data.listScheduleDetails.forEach((item: ScheduleDetails) => {
                if (timeAvailable.length > 0) {
                    if (!timeAvailable.includes(item.time_id)) {
                        timeAvailable.push(item.time_id);
                    }
                } else {
                    timeAvailable = [item.time_id];
                }
            });
            setSelectedTimeKeys(timeAvailable);
        } catch (err: any) {
            console.log(err.message);
            setSchedule({} as Schedule);
            setSelectedTimeKeys([]);
            setSelectedTimeKeys([]);
        }
    };
    const handleOnClickSave = () => {
        if (schedule?.id || isUpdate) {
            let isDiff = false;
            if (
                schedule.listScheduleDetails.length === selectedTimeKeys.length
            ) {
                const existsTimeKeys = schedule.listScheduleDetails.map(
                    (detail: ScheduleDetails) => detail.time_id
                );
                const combined = [
                    ...new Set([...existsTimeKeys, ...selectedTimeKeys]),
                ];

                if (combined.length > schedule.listScheduleDetails.length) {
                    isDiff = true;
                }
                console.log(isDiff);
            } else {
                isDiff = true;
            }
            if (isDiff) {
                handleUpdateSchedule();
            }
        } else {
            handleCreateSchedule();
        }
    };
    const handleUpdateSchedule = () => {
        let deletedDetails: ScheduleDetails[] = [];
        let newTimes: Time[] = [];
        if (selectedTimes.length > schedule.listScheduleDetails.length) {
            console.log('add new time');
            newTimes = selectedTimes.filter((time: Time) => {
                const exist = schedule.listScheduleDetails.find(
                    (detail: ScheduleDetails) => detail.time_id === time.id
                );
                if (!exist) {
                    return time;
                }
            });
            deletedDetails = schedule.listScheduleDetails.filter(
                (detail: ScheduleDetails) => {
                    if (!selectedTimeKeys.includes(detail.time_id)) {
                        return detail;
                    }
                }
            );
        }
        if (selectedTimes.length <= schedule.listScheduleDetails.length) {
            console.log('delete time');
            deletedDetails = schedule.listScheduleDetails.filter(
                (detail: ScheduleDetails) => {
                    if (!selectedTimeKeys.includes(detail.time_id)) {
                        return detail;
                    }
                }
            );
            newTimes = selectedTimes.filter((time: Time) => {
                const exist = schedule.listScheduleDetails.find(
                    (detail: ScheduleDetails) => detail.time_id === time.id
                );
                if (!exist) {
                    return time;
                }
            });
        }
        let scheduleDetailsAvailable = schedule.listScheduleDetails;
        if (newTimes.length > 0) {
            const scheduleDetails: ScheduleDetails[] = [];
            newTimes.forEach((time: Time) => {
                const scheduleDetail: ScheduleDetails = {
                    id: 0,
                    time_id: time.id,
                    schedule_id: null,
                    available: 1,
                    action: 1,
                };
                scheduleDetails.push(scheduleDetail);
            });
            scheduleDetailsAvailable = [
                ...scheduleDetailsAvailable,
                ...scheduleDetails,
            ];
        }
        console.log('deleted', deletedDetails);
        if (deletedDetails.length > 0) {
            scheduleDetailsAvailable = scheduleDetailsAvailable.map(
                (detail: ScheduleDetails) => {
                    if (deletedDetails.includes(detail)) {
                        return { ...detail, action: 3 };
                    } else {
                        return detail;
                    }
                }
            );
        }
        updateSchedule(Number(schedule.id), scheduleDetailsAvailable);
    };
    const updateSchedule = async (
        id: number,
        scheduleDetails: ScheduleDetails[]
    ) => {
        try {
            const data = {
                id: id,
                scheduleDetails: scheduleDetails.filter(
                    (detail: ScheduleDetails) => detail?.action
                ),
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
    const handleCreateSchedule = () => {
        const now = new Date();
        const scheduleDetails: ScheduleDetails[] = [];
        selectedTimes.forEach((selectedTime: Time) => {
            const schedule: ScheduleDetails = {
                id: 0,
                time_id: selectedTime.id,
                schedule_id: null,
                available: 1,
                action: null,
            };
            scheduleDetails.push(schedule);
        });
        let dateOfWeek;
        if (now.getDay() === Number(activeDay)) {
            dateOfWeek = now;
        } else {
            dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
        }
        const schedule = {
            subscriber_id: user.object_id,
            date: `${dateOfWeek.getFullYear()}-${
                dateOfWeek.getMonth() + 1
            }-${dateOfWeek.getDate()}`,
            type: user.role_id === 2 ? 'Bác sĩ' : 'Dịch vụ',
            listScheduleDetails: scheduleDetails,
        };
        CreateSchedule(schedule);
    };
    const CreateSchedule = async (data: any) => {
        try {
            const res = await scheduleService.createSchedule(data, config);
            openNotification(
                'success',
                'Thông báo !',
                'Đăng ký lịch thành công'
            );
            setIsUpdate(true);
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

    useEffect(() => handleGetScheduleBySubscriberAndDate(), [activeDay]);

    useEffect(() => {
        const now = new Date();
        setActiveDay(String(now.getDay()));
    }, []);

    useEffect(() => {
        if (selectedTimes.length > 0 || schedule?.id) {
            setIsVisibleButtonSave(true);
        } else {
            setIsVisibleButtonSave(false);
        }
        console.log('selectedTimes', selectedTimes);
    }, [selectedTimes, schedule]);

    return (
        <div className="">
            {contextHolder}
            <div className="">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Lịch làm việc' },
                    ]}
                ></Breadcrumb>
            </div>
            <div className="mt-3">
                <div className="tabs">
                    {tabs.map((tab) => {
                        return (
                            <Button
                                type={
                                    Number(activeDay) === Number(tab.key)
                                        ? 'primary'
                                        : 'default'
                                }
                                className="me-3"
                                style={{
                                    width: '100px',
                                }}
                                onClick={() => {
                                    setActiveDay(tab.key);
                                    setSelectedTimeKeys([]);
                                    setSelectedTimes([]);
                                    setSchedule({} as Schedule);
                                    setIsUpdate(false);
                                }}
                                key={tab.key}
                            >
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>
                <p className="mt-2">
                    Lưu ý: Nếu bạn muốn đăng ký 2 loại thời gian khác nhau thì
                    bạn cần lưu những thời gian của loại thời gian bạn đang chọn
                    lại. Sau đó mới chuyển sang loại thời gian khác để tránh mất
                    những lựa chọn trước đó của bạn. Đồng thời với trường hợp đó
                    bạn nên chú ý tới thời gian mà mình chọn để không bị trùng
                    thời gian giữa 2 loại thời giạn.
                </p>
                <div>
                    <Select
                        value={timeType}
                        style={{ width: '10%' }}
                        options={[
                            { value: '60 phút', label: '60 phút' },
                            { value: '30 phút', label: '30 phút' },
                        ]}
                        onChange={(e) => {
                            setTimeType(e);
                        }}
                    ></Select>
                </div>
                <ListTime
                    activeDay={Number(activeDay)}
                    timeType={timeType}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                    schedule={schedule}
                />
            </div>
            <div className="group__btn text-center mt-3">
                <Button
                    onClick={() => {
                        handleOnClickSave();
                    }}
                    disabled={!isVisibleButtonSave}
                    type="primary"
                    className="text-white bg-success p-3 fs-6"
                >
                    Lưu
                </Button>
            </div>
        </div>
    );
};
export default ScheduleManagement;
