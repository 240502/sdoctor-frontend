import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Flex, Select, notification } from 'antd';
import { useEffect, useState } from 'react';
import AppointmentTable from '../components/AppointmentTable';
import { Appointment } from '../../../../models/appointment';
import { AppointmentService } from '../../../../services/appointmentService';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
const { Option } = Select;
import { AppointmentStatus } from '../../../../models/appointment_status';
import { AppointmentStatusService } from '../../../../services/appointment_statusService';
type NotificationType = 'success' | 'warning' | 'error';
const AppointmentManagement = () => {
    const user = useRecoilValue(userValue);
    const [api, contextHoler] = notification.useNotification();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [options, setOptions] = useState<any>({ statusId: 1 });
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [appointmentStatuses, setAppointmentStatuses] = useState<
        AppointmentStatus[]
    >([]);
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const getAllAppointmentStatus = async () => {
        try {
            const res = await AppointmentStatusService.getAll();
            console.log(res);
            setAppointmentStatuses(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAppointmentByStatusId = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                type: options.statusId,
                doctorId: user.object_id,
            };
            const res = await AppointmentService.getAppointmentByType(data);
            setAppointments(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setAppointments([]);
            setPageCount(0);
        }
    };
    const onPageChange = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    useEffect(() => {
        getAllAppointmentStatus();
    }, []);

    useEffect(() => {
        getAppointmentByStatusId();
    }, [pageIndex, pageSize, options]);
    return (
        <div className="container">
            {contextHoler}
            <div className="block__filter">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Lịch hẹn',
                        },
                    ]}
                />
                <Divider />
            </div>
            <div className="block__list__appointment">
                <h5 className="mb-3">Danh sách lịch hẹn</h5>
                <Flex className="mb-3">
                    <div className="col-4">
                        <Select
                            className="w-50"
                            value={options.statusId}
                            onChange={(value) => {
                                setOptions({ ...options, statusId: value });
                            }}
                        >
                            {appointmentStatuses.map((status) => {
                                return (
                                    <Option
                                        key={status.id}
                                        value={status.id}
                                        label={status.name}
                                    >
                                        {status.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </Flex>
                <AppointmentTable
                    data={appointments}
                    onPageChange={onPageChange}
                    pageCount={pageCount}
                    pageSize={pageSize}
                    openNotificationWithIcon={openNotificationWithIcon}
                    getAppointmentByStatusId={getAppointmentByStatusId}
                />
            </div>
        </div>
    );
};
export default AppointmentManagement;
