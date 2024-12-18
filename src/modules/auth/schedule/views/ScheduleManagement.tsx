import { HomeOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Flex,
    Select,
    TabsProps,
    notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { ListTime } from '../components/ListTime';
import { DoctorScheduleDetail } from '../../../../models/doctorScheduleDetails';
import { Time } from '../../../../models/time';
import { useRecoilState, useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import { scheduleService } from '../../../../services/doctorScheduleService';
import { DoctorSchedule } from '../../../../models/doctorSchedule';
import { handleGetDateByActiveDay } from '../../../../utils/schedule_management';
type NotificationType = 'success' | 'error';
import '@/assets/scss/schedule_management.scss';
import { scheduleDetailsState } from '../../../../stores/scheduleDetailAtom';
import { TimeService } from '../../../../services/timeService';
import { handleTimeOverRealTime } from '../../../../utils/schedule';
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
    const now = new Date();
    const user = useRecoilValue(userValue);
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [activeDay, setActiveDay] = useState<string>(String(now.getDay()));
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const [selectedTimes, setSelectedTimes] = useState<Time[]>([]);

    const [intervalTime, setIntervalTime] = useState<number>(30);

    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);
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
            doctor_id: user.doctor_id,
            date: `${dateOfWeek.getFullYear()}-${
                dateOfWeek.getMonth() + 1
            }-${dateOfWeek.getDate()}`,
        };

        GetScheduleBySubscriberIdAndDate(data);
    };
    const GetScheduleBySubscriberIdAndDate = async (data: any) => {
        try {
            const res = await scheduleService.viewScheduleForDoctor(data);
            setSchedule(res.data);
            getSelectedTimes(res?.data?.listScheduleDetails);
        } catch (err: any) {
            console.log(err.message);
            setSchedule({} as DoctorSchedule);
            setSelectedTimes([]);
        }
    };
    const getSelectedTimes = (
        doctorScheduleDetails: DoctorScheduleDetail[]
    ) => {
        const now = new Date();
        let selectedTimes: Time[] = [];
        doctorScheduleDetails?.forEach((detail: DoctorScheduleDetail) => {
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
        });
        if (Number(activeDay) === now.getDay()) {
            console.log('handle1');

            const newTimes = handleTimeOverRealTime(selectedTimes);
            setSelectedTimes(newTimes);
            console.log(newTimes);
        }
        if (Number(activeDay) !== 0 && Number(activeDay) < now.getDay()) {
            const newTimes = selectedTimes.map((time: Time) => {
                return { ...time, disable: true };
            });
            console.log('handle2');

            setSelectedTimes(newTimes);
        }
        if (Number(activeDay) === 0 || Number(activeDay) > now.getDay()) {
            setSelectedTimes(selectedTimes);
        }
    };
    useEffect(() => {
        handleGetScheduleBySubscriberAndDate();
        setSelectedTimes([]);
    }, [activeDay]);

    return (
        <div className="schedule-management">
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
                                    setSchedule({} as DoctorSchedule);
                                    setIsUpdate(false);
                                    setDoctorScheduleDetails([]);
                                }}
                                key={tab.key}
                            >
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>
                <div className="w-25 mt-3 mb-3">
                    <Select
                        className="w-100"
                        value={intervalTime}
                        placeholder="Chọn loại thời gian"
                        onChange={(value: number) => {
                            setIntervalTime(value);
                        }}
                    >
                        <Select.Option value={30}>30 phút</Select.Option>
                        <Select.Option value={60}>60 phút</Select.Option>
                    </Select>
                </div>
                <p>
                    Lưu ý: Để tránh xung đột thời gian, bạn nên chỉ 1 loại thời
                    gian hoặc nếu chọn 2 loại thời gian khác nhau nên chú ý tới
                    thời gian bắt đầu của nó để không bị trùng nhau
                </p>
                <Card
                    className="card-time mt-3"
                    title={
                        <Flex className="justify-content-between align-items-center ">
                            {
                                tabs[
                                    Number(activeDay) !== 0
                                        ? Number(activeDay) - 1
                                        : 6
                                ].label
                            }
                        </Flex>
                    }
                >
                    <ListTime
                        activeDay={Number(activeDay)}
                        schedule={schedule}
                        user={user}
                        config={config}
                        setSchedule={setSchedule}
                        openNotification={openNotification}
                        handleGetScheduleBySubscriberAndDate={
                            handleGetScheduleBySubscriberAndDate
                        }
                        interval={intervalTime}
                        selectedTimes={selectedTimes}
                        setSelectedTimes={setSelectedTimes}
                    />
                </Card>
            </div>
        </div>
    );
};
export default ScheduleManagement;
