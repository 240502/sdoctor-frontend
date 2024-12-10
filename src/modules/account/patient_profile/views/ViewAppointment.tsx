import React, { useEffect, useRef, useState } from 'react';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';
import {
    Appointment,
    AppointmentViewForPatient,
} from '../../../../models/appointment';
import { AppointmentService } from '../../../../services/appointmentService';
import {
    Button,
    Input,
    InputRef,
    Pagination,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    notification,
} from 'antd';
import { TableColumnsType } from 'antd';
import { CloseOutlined, EyeOutlined, RedoOutlined } from '@ant-design/icons';
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { ModalConfirmCancelAppointment } from '../components/ModalConfirmCancelAppointment';
import { useNavigate } from 'react-router-dom';
import { AppointmentStatus } from '../../../../models/appointment_status';
import { AppointmentStatusService } from '../../../../services/appointment_statusService';
type NotificationType = 'success' | 'error';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

type DataIndex = keyof AppointmentViewForPatient;
const { Option } = Select;
const ViewAppointment = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    const [isView, setIsView] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const patientProfile = useRecoilValue(patientProfileValue);
    const [appointment, setAppointment] = useState<Appointment>(
        {} as Appointment
    );
    const [appointmentStatuses, setAppointmentStatuses] = useState<
        AppointmentStatus[]
    >([]);
    const [appointments, setAppointments] = useState<
        AppointmentViewForPatient[]
    >([]);
    const getAllAppointmentStatus = async () => {
        try {
            const res = await AppointmentStatusService.getAll();
            console.log(res);
            setAppointmentStatuses(res);
        } catch (err: any) {
            setAppointmentStatuses([]);

            console.log(err.message);
        }
    };
    const onChangePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageSize(size);
            setPageIndex(1);
        } else {
            setPageIndex(current);
        }
    };
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(
                            selectedKeys as string[],
                            confirm,
                            dataIndex
                        )
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(
                                selectedKeys as string[],
                                confirm,
                                dataIndex
                            )
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined
                style={{ color: filtered ? '#1677ff' : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),

        render: (text: any) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns: TableColumnsType<AppointmentViewForPatient> = [
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor_name',
            ...getColumnSearchProps('doctor_name'),
        },
        {
            title: 'Địa điểm khám',
            dataIndex: 'location',
            ...getColumnSearchProps('location'),
            render: (text) => (
                <p
                    style={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {text}
                </p>
            ),
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointment_date',
            render: (_, record) => (
                <>{record.appointment_date.toString().slice(0, 10)}</>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'time_value',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status_name',
            render: (_, record) => (
                <Tag
                    color={
                        record.status_id === 1
                            ? 'geekblue'
                            : record.status_id === 2
                            ? 'green'
                            : record.status_id === 3
                            ? 'error'
                            : 'cyan'
                    }
                >
                    {record.status_name.toUpperCase()}
                </Tag>
            ),

            filters: [
                {
                    text: 'Chờ xác nhận',
                    value: 'Chờ xác nhận',
                },
                {
                    text: 'Đã xác nhận',
                    value: 'Đã xác nhận',
                },
                {
                    text: 'Hoàn thành',
                    value: 'Hoàn thành',
                },
            ],
            onFilter: (value, record) =>
                record.status_name.indexOf(value as string) === 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Appointment) => (
                <>
                    {record.status_id === 4 && (
                        <Tooltip placement="topLeft" title={'Đặt lại'}>
                            <Button
                                className="mb-2"
                                onClick={() => {
                                    navigate(
                                        '/doctor/detail/' + record.doctor_id
                                    );
                                }}
                            >
                                <RedoOutlined />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                        <Button
                            className="mb-2 border border-info"
                            onClick={() => {
                                setIsModalOpen(true);
                                setAppointment(record);
                                setIsView(true);
                                console.log('appointment', record);
                            }}
                        >
                            <EyeOutlined className="text-info" />
                        </Button>
                    </Tooltip>
                    {record.status_id === 1 && (
                        <Tooltip placement="topLeft" title={'Hủy lịch hẹn'}>
                            <Button
                                className=""
                                danger
                                onClick={() => {
                                    console.log(record);
                                    setIsOpenModalConfirm(true);
                                    setAppointment(record);
                                }}
                            >
                                <CloseOutlined className="text-danger" />
                            </Button>
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    const getAppointmentByPatientPhone = async () => {
        const data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            phone: patientProfile.patient_phone,
            statusId: null,
        };
        try {
            const res = await AppointmentService.viewAppointmentForPatient(
                data
            );
            console.log(res);
            setAppointments(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
    };
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };

    useEffect(() => {
        getAppointmentByPatientPhone();
    }, [pageIndex, pageSize]);
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllAppointmentStatus();
    }, []);
    return (
        <PatientProfileLayout breadcrumb={'Lịch hẹn'}>
            {appointments?.length > 0 ? (
                <>
                    {contextHolder}{' '}
                    <Table<AppointmentViewForPatient>
                        bordered
                        columns={columns}
                        dataSource={appointments}
                        pagination={false}
                    />
                    {pageCount > 1 && (
                        <Pagination
                            pageSize={pageSize}
                            current={pageIndex}
                            total={pageCount * pageSize}
                            align="center"
                            className="mt-3"
                            showSizeChanger
                            pageSizeOptions={['5', '10', '20', '30']}
                            onChange={onChangePage}
                        />
                    )}
                    {isModalOpen && (
                        <ModalViewAppointment
                            handleCancelModal={handleCancelModal}
                            isModalOpen
                            appointment={appointment}
                            isView={isView}
                        />
                    )}
                    {isOpenModalConfirm && (
                        <ModalConfirmCancelAppointment
                            isOpenModalConfirm
                            handleCancelModalConfirm={handleCancelModalConfirm}
                            appointment={appointment}
                            setIsOpenModalConfirm={setIsOpenModalConfirm}
                            openNotificationWithIcon={openNotificationWithIcon}
                            getAppointmentByPatientPhone={
                                getAppointmentByPatientPhone
                            }
                        />
                    )}
                </>
            ) : (
                <div>Không có lịch hẹn nào</div>
            )}
        </PatientProfileLayout>
    );
};
export default ViewAppointment;
