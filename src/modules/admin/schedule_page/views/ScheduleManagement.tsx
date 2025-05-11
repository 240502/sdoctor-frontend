import { HomeOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Flex,
    Select,
    TabsProps,
    message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ListTime } from '../components/ListTime';
import { Time } from '../../../../models/time';
import { useRecoilValue } from 'recoil';
import { configValue, userValue } from '../../../../stores/userAtom';
import '@/assets/scss/schedule_management.scss';
import { useFetchTimeByType } from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
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
    const [activeDay, setActiveDay] = useState<string>(String(now.getDay()));
    const [messageApi, contextHolder] = message.useMessage();
    const [intervalTime, setIntervalTime] = useState<number>(30);
    const [times, setTimes] = useState<Time[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

    const openMessage = (type: NoticeType, des: string) => {
        messageApi.open({
            type: type,
            content: des,
        });
    };
    // Hàm để refetch với date mới
    const handleRefetch = (activeDate: number) => {
        const dayNow = dayjs(date).day();
        const diff = activeDate === 0 ? dayNow - dayNow : activeDate - dayNow;

        const newDate = dayjs(date).add(diff, 'day').format('YYYY-MM-DD');
        setDate(newDate); // Cập nhật state date
    };
    const { data: timesResponse, isFetching: isFetchingTime } =
        useFetchTimeByType(intervalTime);

    useEffect(() => {
        if (timesResponse && timesResponse?.length > 0) {
            handleTimes(timesResponse);
        }
    }, [timesResponse, activeDay]);

    const handleTimes = async (times: Time[]) => {
        if (Number(activeDay) === dayjs().day()) {
            console.log('if 1');

            const newTimes = handleTimeOverRealTime(timesResponse);
            setTimes(newTimes);
        }

        if (Number(activeDay) !== 0 && Number(activeDay) < dayjs().day()) {
            console.log('if 2');

            const newTimes = times.map((time: Time) => {
                return { ...time, disable: true };
            });
            setTimes(newTimes);
        }
        if (Number(activeDay) > dayjs().day()) {
            console.log('if 3');

            setTimes(times);
        }
    };
    useEffect(() => {
        console.log('times', times);
    }, [times]);

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
                                    if (Number(activeDay) !== Number(tab.key)) {
                                        setActiveDay(tab.key);
                                        handleRefetch(Number(tab.key));
                                        setIsUpdate(false);
                                    }
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
                        doctorId={user.userId}
                        headerConfig={config}
                        openMessage={openMessage}
                        interval={intervalTime}
                        times={times}
                        isFetchingTime={isFetchingTime}
                        date={date}
                    />
                </Card>
            </div>
        </div>
    );
};
export default ScheduleManagement;
