import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { ListTime } from '../components/ListTime';
import { ScheduleDetails } from '../../../../models/schedule_details';
import { Time } from '../../../../models/time';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
import { scheduleService } from '../../../../services/scheduleService';
import { Schedule } from '../../../../models/schdule';
const { TabPane } = Tabs;
const ScheduleManagement = () => {
    const [config, setConfig] = useState<any>();

    const user = useRecoilValue(userValue);
    const [timeType, setTimeType] = useState<string>('60 phút');
    const [activeKey, setDefaultActiveKey] = useState<string>('1');

    const [selectedTimes, setSelectedTimes] = useState<Time[]>([]);
    const [selectedTimeKeys, setSelectedTimeKeys] = useState<number[]>([]);
    const [schedule, setSchedule] = useState<Schedule>();
    const [isVisibleButtonSave, setIsVisibleButtonSave] =
        useState<boolean>(false);
    useEffect(() => {
        handleGetScheduleBySubscriberAndDate();
        const header = {
            headers: { authorization: 'Bearer ' + user.token },
        };
        setConfig(header);
        const now = new Date();
        setDefaultActiveKey(String(now.getDay()));
    }, []);

    useEffect(() => {
        if (selectedTimes.length > 0) {
            setIsVisibleButtonSave(true);
        } else {
            setIsVisibleButtonSave(false);
        }
    }, [selectedTimes]);
    const handleGetScheduleBySubscriberAndDate = () => {
        const now = new Date();
        let dateOfWeek;
        if (now.getDay() === Number(activeKey)) {
            dateOfWeek = now;
        } else {
            dateOfWeek = handleGetDate(now, Number(activeKey));
        }
        const data = {
            subscriberId: user.id,
            date: dateOfWeek.toISOString().slice(0, 19).replace('T', ' '),
            type: user.role_id === 2 ? 'Bác sĩ' : 'Gói khám',
        };
        GetScheduleBySubscriberIdAndDate(data);
    };
    const GetScheduleBySubscriberIdAndDate = async (data: any) => {
        try {
            const res = await scheduleService.getBySubscriberIdAndDate(data);
            setSchedule(res.data);
            let timeAvailable: any = [];
            res.data.listScheduleDetails.forEach((item: ScheduleDetails) => {
                if (timeAvailable.length > 0) {
                    timeAvailable.push(item.time_id);
                } else {
                    timeAvailable = [item.time_id];
                }
            });
            setSelectedTimeKeys(timeAvailable);
        } catch (err: any) {
            console.error(err.message);
        }
    };
    const handleUpdateSchedule = () => {
        console.log('update');
        const newTimes = selectedTimes.filter((time: Time) => {
            const exists = schedule?.listScheduleDetails.find(
                (detail: ScheduleDetails) => {
                    return detail.time_id === time.id;
                }
            );
            if (!exists) {
                return time;
            }
        });
        console.log('new', newTimes);
    };
    const handleCreateSchedule = () => {
        const scheduleDetails: ScheduleDetails[] = [];
        selectedTimes.forEach((selectedTime: Time) => {
            const schedule: ScheduleDetails = {
                id: null,
                time_id: selectedTime.id,
                schedule_id: null,
                available: 1,
            };
            scheduleDetails.push(schedule);
        });
        const now = new Date();
        console.log('now', now.getDate());
        let dateOfWeek;
        if (now.getDay() === Number(activeKey)) {
            dateOfWeek = now;
        } else {
            dateOfWeek = handleGetDate(now, Number(activeKey));
        }
        const schedule = {
            subscriber_id: user.id,
            date: dateOfWeek.toISOString().slice(0, 19).replace('T', ' '),
            type: user.role_id === 2 ? 'Bác sĩ' : 'Dịch vụ',
            listScheduleDetails: scheduleDetails,
        };
        console.log(schedule);
        CreateSchedule(schedule);
    };
    const CreateSchedule = async (data: any) => {
        try {
            const res = await scheduleService.createSchedule(data, config);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleGetDate = (now: Date, dayOfWeekNumber: number) => {
        let startDateOfWeek: any;
        switch (now.getDay()) {
            case 1:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                );

                break;
            case 2:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 1
                );

                break;
            case 3:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 2
                );

                break;
            case 4:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 3
                );

                break;
            case 5:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 4
                );

                break;
            case 6:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 5
                );

                break;
            case 0:
                startDateOfWeek = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 6
                );

                break;
        }
        let dateOfWeek: any;
        if (dayOfWeekNumber !== 0) {
            dateOfWeek = new Date(
                startDateOfWeek?.getFullYear(),
                startDateOfWeek?.getMonth(),
                startDateOfWeek?.getDate() + (dayOfWeekNumber - 1)
            );
        } else {
            dateOfWeek = new Date(
                startDateOfWeek?.getFullYear(),
                startDateOfWeek?.getMonth(),
                startDateOfWeek?.getDate() + 6
            );
        }
        return dateOfWeek;
    };
    const tabs = [
        {
            key: 1,
            tab: <h6 className="ps-3 pe-3">Thứ hai</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={1}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                    scheduleDetails={schedule?.listScheduleDetails}
                />
            ),
        },
        {
            key: 2,
            tab: <h6 className="ps-3 pe-3">Thứ ba</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={2}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
        {
            key: 3,
            tab: <h6 className="ps-3 pe-3">Thứ tư</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={3}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
        {
            key: 4,
            tab: <h6 className="ps-3 pe-3">Thứ năm</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={4}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
        {
            key: 5,
            tab: <h6 className="ps-3 pe-3">Thứ sáu</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={5}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
        {
            key: 6,
            tab: <h6 className="ps-3 pe-3">Thứ bảy</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={6}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
        {
            key: 0,
            tab: <h6 className="ps-3 pe-3">Chủ nhật</h6>,
            component: (
                <ListTime
                    timeType={timeType}
                    day={0}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    selectedTimeKeys={selectedTimeKeys}
                    setSelectedTimeKeys={setSelectedTimeKeys}
                />
            ),
        },
    ];
    return (
        <div className="">
            <div className="">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Lịch làm việc' },
                    ]}
                ></Breadcrumb>
            </div>
            <div className="mt-3">
                <Tabs
                    activeKey={activeKey !== undefined ? activeKey : '1'}
                    onChange={(key) => setDefaultActiveKey(key)}
                >
                    {tabs.map((item: any, index: number) => {
                        return (
                            <TabPane className="" tab={item.tab} key={item.key}>
                                <div className="block__type__time">
                                    <Select
                                        style={{ width: '15%' }}
                                        defaultValue={timeType}
                                        onChange={(e) => {
                                            setTimeType(e);
                                        }}
                                    >
                                        <Select.Option value={'60 phút'}>
                                            60 phút
                                        </Select.Option>
                                        <Select.Option value={'30 phút'}>
                                            30 phút
                                        </Select.Option>
                                    </Select>
                                    <p className="ps-1 pt-3">
                                        Lưu ý: Thời gian đăng ký cần cùng loại.
                                        Trong trường hợp bạn đang chọn những
                                        thời gian thuộc loại 60 phút sau đó bạn
                                        chuyển sang chọn các thời gian loại 30
                                        phút. Những thời gian ở loại 60 phút mà
                                        bạn chọn trước đó sẽ mất đi và hệ thống
                                        chỉ ghi nhận các thời gian cùng loại 30
                                        phút.
                                    </p>
                                </div>
                                {item.component}
                            </TabPane>
                        );
                    })}
                </Tabs>
            </div>
            <div className="group__btn text-center mt-3">
                <Button
                    onClick={() => {
                        schedule !== undefined
                            ? handleUpdateSchedule()
                            : handleCreateSchedule();
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
