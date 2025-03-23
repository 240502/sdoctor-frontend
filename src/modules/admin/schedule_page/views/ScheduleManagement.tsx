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
import { DoctorScheduleDetail } from '../../../../models/doctor_schedule_details';
import { Time } from '../../../../models/time';
import { useRecoilState, useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import { scheduleService } from '../../../../services/doctor_schedule.service';
import { DoctorSchedule } from '../../../../models/doctor_schedule';
import { handleGetDateByActiveDay } from '../../../../utils/schedule_management';
type NotificationType = 'success' | 'error';
import '@/assets/scss/schedule_management.scss';
import { scheduleDetailsState } from '../../../../stores/scheduleDetailAtom';
import { handleTimeOverRealTime } from '../../../../utils/schedule';
import { scheduleListState } from '../../../../stores/scheduleAtom';
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
    const [doctorSchedules, setDoctorSchedules] =
        useRecoilState(scheduleListState);
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
    const [selectedTimes, setSelectedTimes] = useState<Time[]>([]);

    const [intervalTime, setIntervalTime] = useState<number>(30);

    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);

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
        if (doctorSchedules.length > 0) {
            let doctorSchedule: DoctorSchedule | any = doctorSchedules.find(
                (schedule: DoctorSchedule) => {
                    const date = new Date(schedule.date);
                    if (
                        schedule.doctorId === user.doctorId &&
                        date.getFullYear() === dateOfWeek.getFullYear() &&
                        date.getMonth() + 1 === dateOfWeek.getMonth() + 1 &&
                        date.getDate() === dateOfWeek.getDate()
                    ) {
                        return schedule;
                    }
                }
            );
            if (doctorSchedule) {
                setSchedule(doctorSchedule);
                getSelectedTimes(doctorSchedule.doctorScheduleDetails);
            } else {
                const data = {
                    doctorId: user.doctorId,
                    date: `${dateOfWeek.getFullYear()}-${
                        dateOfWeek.getMonth() + 1
                    }-${dateOfWeek.getDate()}`,
                    viewType: 'doctor',
                };
                GetScheduleBySubscriberIdAndDate(data);
            }
        } else {
            const data = {
                doctorId: user.doctorId,
                date: `${dateOfWeek.getFullYear()}-${
                    dateOfWeek.getMonth() + 1
                }-${dateOfWeek.getDate()}`,
                viewType: 'doctor',
            };
            console.log('call api', data);
            GetScheduleBySubscriberIdAndDate(data);
        }
    };

    const GetScheduleBySubscriberIdAndDate = async (data: any) => {
        try {
            const res = await scheduleService.viewSchedule(data);

            if (doctorSchedules.length > 0) {
                if (
                    !doctorSchedules.find(
                        (schedule: DoctorSchedule) => schedule.id === res.id
                    )
                ) {
                    const newDoctorSchedules = [...doctorSchedules, res];
                    setDoctorSchedules(newDoctorSchedules);
                    console.log('new doctor schedules', newDoctorSchedules);
                }
            } else {
                setDoctorSchedules([res]);
            }
            setSchedule(res);
            getSelectedTimes(res?.doctorScheduleDetails);
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
                id: detail.timeId,
                startTime: detail.startTime,
                endTime: detail.endTime,
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

            selectedTimes = handleTimeOverRealTime(selectedTimes);
            setSelectedTimes(selectedTimes);
            console.log('newTimes', selectedTimes);
        }
        if (Number(activeDay) !== 0 && Number(activeDay) < now.getDay()) {
            selectedTimes = selectedTimes.map((time: Time) => {
                return { ...time, disable: true };
            });
            console.log('handle2');
            console.log('newTimes', selectedTimes);
            setSelectedTimes(selectedTimes);
        }
        if (Number(activeDay) === 0 || Number(activeDay) > now.getDay()) {
            setSelectedTimes(selectedTimes);
        }
    };
    useEffect(() => {
        setSelectedTimes([]);
        handleGetScheduleBySubscriberAndDate();
    }, [activeDay]);
    useEffect(() => {
        console.log('selectedTimes', selectedTimes);
    }, [selectedTimes]);
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
