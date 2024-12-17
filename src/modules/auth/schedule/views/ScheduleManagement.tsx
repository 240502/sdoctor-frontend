import { ClockCircleOutlined, HomeOutlined } from '@ant-design/icons';
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
    const [intervalTime, setIntervalTime] = useState<number>(30);

    const [doctorScheduleDetails, setDoctorScheduleDetails] =
        useRecoilState(scheduleDetailsState);
    const [isVisibleButtonSave, setIsVisibleButtonSave] =
        useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [openAddSlotsModal, setOpenAddSlotsModal] = useState<boolean>(false);
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
            //setDoctorScheduleDetails(res?.data?.listScheduleDetails);
            // let timeAvailable: any = [];
            // res.data.listScheduleDetails.forEach(
            //     (item: DoctorScheduleDetail) => {
            //         if (timeAvailable.length > 0) {
            //             if (!timeAvailable.includes(item.time_id)) {
            //                 timeAvailable.push(item.time_id);
            //             }
            //         } else {
            //             timeAvailable = [item.time_id];
            //         }
            //     }
            // );
            // setSelectedTimeKeys(timeAvailable);
        } catch (err: any) {
            console.log(err.message);
            setSchedule({} as DoctorSchedule);
            // setSelectedTimeKeys([]);
        }
    };

    const handleUpdateSchedule = () => {
        let deletedDetails: DoctorScheduleDetail[] = [];
        console.log(doctorScheduleDetails.length);
        let newTimes: Time[] = [];
        if (
            doctorScheduleDetails.length > schedule.listScheduleDetails.length
        ) {
            const newDetails = doctorScheduleDetails.map(
                (detail: DoctorScheduleDetail) => {
                    if (!schedule.listScheduleDetails.includes(detail)) {
                        return { ...detail, action: 1 };
                    } else return detail;
                }
            );
            console.log('add new time', newDetails);

            updateSchedule(Number(schedule.id), newDetails);
            // newTimes = doctorScheduleDetails.filter((time: Time) => {
            //     const exist = schedule.listScheduleDetails.find(
            //         (detail: DoctorScheduleDetail) => detail.time_id === time.id
            //     );
            //     if (!exist) {
            //         return time;
            //     }
            // });
            // deletedDetails = schedule.listScheduleDetails.filter(
            //     (detail: DoctorScheduleDetail) => {
            //         if (!selectedTimeKeys.includes(detail.time_id)) {
            //             return detail;
            //         }
            //     }
            // );
        }
        // if (selectedTimes.length <= schedule.listScheduleDetails.length) {
        //     console.log('delete time');
        //     deletedDetails = schedule.listScheduleDetails.filter(
        //         (detail: DoctorScheduleDetail) => {
        //             if (!selectedTimeKeys.includes(detail.time_id)) {
        //                 return detail;
        //             }
        //         }
        //     );
        //     newTimes = selectedTimes.filter((time: Time) => {
        //         const exist = schedule.listScheduleDetails.find(
        //             (detail: DoctorScheduleDetail) => detail.time_id === time.id
        //         );
        //         if (!exist) {
        //             return time;
        //         }
        //     });
        // }
        // let scheduleDetailsAvailable = schedule.listScheduleDetails;
        // if (newTimes.length > 0) {
        //     const scheduleDetails: DoctorScheduleDetail[] = [];
        //     newTimes.forEach((time: Time) => {
        //         const scheduleDetail: DoctorScheduleDetail = {
        //             id: 0,
        //             time_id: time.id,
        //             schedule_id: null,
        //             available: 1,
        //             action: 1,
        //         };
        //         scheduleDetails.push(scheduleDetail);
        //     });
        //     scheduleDetailsAvailable = [
        //         ...scheduleDetailsAvailable,
        //         ...scheduleDetails,
        //     ];
        // }
        // console.log('deleted', deletedDetails);
        // if (deletedDetails.length > 0) {
        //     scheduleDetailsAvailable = scheduleDetailsAvailable.map(
        //         (detail: DoctorScheduleDetail) => {
        //             if (deletedDetails.includes(detail)) {
        //                 return { ...detail, action: 3 };
        //             } else {
        //                 return detail;
        //             }
        //         }
        //     );
        // }
    };
    const updateSchedule = async (
        id: number,
        scheduleDetails: DoctorScheduleDetail[]
    ) => {
        try {
            const data = {
                id: id,
                scheduleDetails: scheduleDetails.filter(
                    (detail: DoctorScheduleDetail) => detail?.action
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
    useEffect(() => {
        console.log('call api');
        handleGetScheduleBySubscriberAndDate();
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
                    />
                </Card>
            </div>
        </div>
    );
};
export default ScheduleManagement;
