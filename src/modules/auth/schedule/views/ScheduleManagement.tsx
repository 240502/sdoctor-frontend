import { ClockCircleOutlined, HomeOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Flex,
    Row,
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
import { AddSlotModal } from '../components/AddSlotModal';
import {
    scheduleDetailsState,
    scheduleDetailsValue,
} from '../../../../stores/scheduleDetailAtom';
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
    const [activeDay, setActiveDay] = useState<string>('1');
    const [schedule, setSchedule] = useState<DoctorSchedule>(
        {} as DoctorSchedule
    );
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

    const cancelAddSlotsModal = () => {
        setOpenAddSlotsModal(false);
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
            console.log('call api');
            setSchedule(res.data);
            setDoctorScheduleDetails(res?.data?.listScheduleDetails);
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
    const handleOnClickSave = () => {
        // if (schedule?.id || isUpdate) {
        //     let isDiff = false;
        //     if (
        //         schedule.listScheduleDetails.length === selectedTimeKeys.length
        //     ) {
        //         const existsTimeKeys = schedule.listScheduleDetails.map(
        //             (detail: DoctorScheduleDetail) => detail.time_id
        //         );
        //         const combined = [
        //             ...new Set([...existsTimeKeys, ...selectedTimeKeys]),
        //         ];

        //         if (combined.length > schedule.listScheduleDetails.length) {
        //             isDiff = true;
        //         }
        //     } else {
        //         isDiff = true;
        //     }
        //     if (isDiff) {
        //         handleUpdateSchedule();
        //     }
        // } else {
        handleCreateSchedule();
        // }
    };
    // const handleUpdateSchedule = () => {
    //     let deletedDetails: DoctorScheduleDetail[] = [];
    //     let newTimes: Time[] = [];
    //     if (selectedTimes.length > schedule.listScheduleDetails.length) {
    //         console.log('add new time');
    //         newTimes = selectedTimes.filter((time: Time) => {
    //             const exist = schedule.listScheduleDetails.find(
    //                 (detail: DoctorScheduleDetail) => detail.time_id === time.id
    //             );
    //             if (!exist) {
    //                 return time;
    //             }
    //         });
    //         deletedDetails = schedule.listScheduleDetails.filter(
    //             (detail: DoctorScheduleDetail) => {
    //                 if (!selectedTimeKeys.includes(detail.time_id)) {
    //                     return detail;
    //                 }
    //             }
    //         );
    //     }
    //     if (selectedTimes.length <= schedule.listScheduleDetails.length) {
    //         console.log('delete time');
    //         deletedDetails = schedule.listScheduleDetails.filter(
    //             (detail: DoctorScheduleDetail) => {
    //                 if (!selectedTimeKeys.includes(detail.time_id)) {
    //                     return detail;
    //                 }
    //             }
    //         );
    //         newTimes = selectedTimes.filter((time: Time) => {
    //             const exist = schedule.listScheduleDetails.find(
    //                 (detail: DoctorScheduleDetail) => detail.time_id === time.id
    //             );
    //             if (!exist) {
    //                 return time;
    //             }
    //         });
    //     }
    //     let scheduleDetailsAvailable = schedule.listScheduleDetails;
    //     if (newTimes.length > 0) {
    //         const scheduleDetails: DoctorScheduleDetail[] = [];
    //         newTimes.forEach((time: Time) => {
    //             const scheduleDetail: DoctorScheduleDetail = {
    //                 id: 0,
    //                 time_id: time.id,
    //                 schedule_id: null,
    //                 available: 1,
    //                 action: 1,
    //             };
    //             scheduleDetails.push(scheduleDetail);
    //         });
    //         scheduleDetailsAvailable = [
    //             ...scheduleDetailsAvailable,
    //             ...scheduleDetails,
    //         ];
    //     }
    //     console.log('deleted', deletedDetails);
    //     if (deletedDetails.length > 0) {
    //         scheduleDetailsAvailable = scheduleDetailsAvailable.map(
    //             (detail: DoctorScheduleDetail) => {
    //                 if (deletedDetails.includes(detail)) {
    //                     return { ...detail, action: 3 };
    //                 } else {
    //                     return detail;
    //                 }
    //             }
    //         );
    //     }
    //     updateSchedule(Number(schedule.id), scheduleDetailsAvailable);
    // };
    // const updateSchedule = async (
    //     id: number,
    //     scheduleDetails: DoctorScheduleDetail[]
    // ) => {
    //     try {
    //         const data = {
    //             id: id,
    //             scheduleDetails: scheduleDetails.filter(
    //                 (detail: DoctorScheduleDetail) => detail?.action
    //             ),
    //         };

    //         const res = await scheduleService.updateSchedule(data, config);
    //         handleGetScheduleBySubscriberAndDate();
    //         openNotification(
    //             'success',
    //             'Thông báo !',
    //             'Cập nhập thời gian thành công!'
    //         );
    //     } catch (err: any) {
    //         console.log(err.message);
    //         openNotification(
    //             'error',
    //             'Thông báo !',
    //             'Cập nhập thời gian không thành công!'
    //         );
    //     }
    // };
    const handleCreateSchedule = () => {
        const now = new Date();
        let dateOfWeek;
        if (now.getDay() === Number(activeDay)) {
            dateOfWeek = now;
        } else {
            dateOfWeek = handleGetDateByActiveDay(Number(activeDay));
        }
        const schedule = {
            doctor_id: user.doctor_id,
            date: `${dateOfWeek.getFullYear()}-${
                dateOfWeek.getMonth() + 1
            }-${dateOfWeek.getDate()}`,
            listScheduleDetails: doctorScheduleDetails,
        };
        CreateSchedule(schedule);
    };
    const CreateSchedule = async (data: any) => {
        try {
            console.log(data);
            const res = await scheduleService.createSchedule(data, config);
            setSchedule(res?.data.result);
            setDoctorScheduleDetails(res?.data?.result.listScheduleDetails);
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
                            <Flex className="group-button justify-content-between">
                                <Button
                                    className="border-0 text-primary fw-bold col-6"
                                    onClick={() => {
                                        setOpenAddSlotsModal(true);
                                    }}
                                >
                                    Thêm thời gian
                                </Button>
                                <Button className="text-danger  border-0 fw-bold col-6">
                                    Xóa tất cả
                                </Button>
                            </Flex>
                        </Flex>
                    }
                >
                    <ListTime
                        activeDay={Number(activeDay)}
                        schedule={schedule}
                    />
                </Card>
            </div>
            <div className="group__btn text-center mt-3">
                <Button
                    onClick={() => {
                        handleOnClickSave();
                    }}
                    // disabled={!isVisibleButtonSave}
                    type="primary"
                    className="text-white bg-success p-3 fs-6"
                >
                    Lưu
                </Button>
            </div>
            {
                <AddSlotModal
                    openModal={openAddSlotsModal}
                    cancelAddSlotsModal={cancelAddSlotsModal}
                />
            }
        </div>
    );
};
export default ScheduleManagement;
