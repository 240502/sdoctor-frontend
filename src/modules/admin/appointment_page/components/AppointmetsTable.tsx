import Table, { ColumnsType } from 'antd/es/table';
import { AppointmentResponseDto } from '../../../../models/appointment';
import {
    Button,
    Col,
    Input,
    InputRef,
    Pagination,
    Row,
    Skeleton,
    Space,
    Tag,
    DatePicker,
    TabsProps,
    message,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useFetchAppointmentWithOptions } from '../../../../hooks/appointments/useFetchAppointmentWithOptions';
type DataIndex = keyof AppointmentResponseDto;
const { RangePicker } = DatePicker;
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
dayjs.locale('vi');

import { useNavigate } from 'react-router-dom';
import { useFetchTotalAppointmentByStatus } from '../../../../hooks/appointments/useAppointment';
import { useUpdateAppointmentStatus } from '../../../../hooks';
import { InvoiceModal } from './InvoiceModal';
import { NoticeType } from 'antd/es/message/interface';
const tabs: TabsProps['items'] = [
    {
        key: '2',
        label: <h6 className="m-0">Chờ khám</h6>,
    },
    {
        key: '5',
        label: <h6 className="m-0">Đang khám</h6>,
    },
    {
        key: '4',
        label: <h6 className="m-0">Hoàn thành</h6>,
    },
    {
        key: '3',
        label: <h6 className="m-0">Đã hủy</h6>,
    },
];
const AppointmentsTable = ({ openNotificationWithIcon, userId }: any) => {
    const [api, contextHolder] = message.useMessage();
    const [isUpdateInvoice, setIsUpdateInvoice] = useState<boolean>(false);
    const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
    const [appointmentId, setAppointmentId] = useState<number | null>(null);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [options, setOptions] = useState<{
        pageIndex: number;
        pageSize: number;
        status: number;
        userId: number;
        fromDate: Dayjs;
        toDate: Dayjs;
    }>({
        userId: userId,
        pageIndex: 1,
        pageSize: 8,
        status: 2,
        fromDate: dayjs().startOf('isoWeek'),
        toDate: dayjs().endOf('isoWeek'),
    });

    const { data, error, isError, isFetching, refetch, isRefetching } =
        useFetchAppointmentWithOptions(options);

    const { data: totalAppointment } = useFetchTotalAppointmentByStatus(
        options.userId
    );
    const { mutate: updateAppointmentStatus } = useUpdateAppointmentStatus();
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
    const openMessage = (type: NoticeType, content: string) => {
        api.open({ type, content });
    };

    const cancelInvoiceModal = () => {
        setOpenInvoiceModal(false);
        if (isUpdateInvoice) {
            setIsUpdateInvoice(true);
        }
        navigate('/admin/appointment');
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

    const onChangePage = (current: number, size: number) => {
        if (Number(size) !== options.pageSize) {
            setOptions({ ...options, pageIndex: 1, pageSize: size });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
    };
    const onDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setOptions({ ...options, fromDate: dates[0], toDate: dates[1] });
        } else {
            // Nếu dates là null hoặc có giá trị null, đặt lại về tuần hiện tại
            setOptions({
                ...options,
                fromDate: dayjs().startOf('isoWeek'),
                toDate: dayjs().endOf('isoWeek'),
            });
        }
    };
    const columns: ColumnsType<AppointmentResponseDto> = [
        {
            title: 'Họ và tên',
            dataIndex: 'patientName',
            ...getColumnSearchProps('patientName'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'patientPhone',
            ...getColumnSearchProps('patientPhone'),
        },
        {
            title: 'Tuổi',
            dataIndex: 'birthday',

            render: (_, record) => {
                const now = new Date();
                return (
                    now.getFullYear() -
                    Number(record.birthday.toString().slice(0, 4))
                );
            },
            sorter: (a, b) => {
                const now = new Date();
                const ageA =
                    now.getFullYear() -
                    Number(a.birthday.toString().slice(0, 4));
                const ageB =
                    now.getFullYear() -
                    Number(b.birthday.toString().slice(0, 4));
                return ageA - ageB;
            },
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointmentDate',
            render: (_, record) => {
                return (
                    <>
                        {dayjs(
                            record.appointmentDate.toString().split('T')[0]
                        ).format('DD-MM-YYYY')}
                    </>
                );
            },
        },
        {
            title: 'Giờ hẹn',
            dataIndex: 'timeValue',
            render: (_, record) => {
                return <>{record.startTime + '-' + record.endTime}</>;
            },
        },
        {
            title: 'Trạng thái hóa đơn',
            dataIndex: 'invoiceStatus',
            render: (_, record) => (
                <Tag
                    color={
                        record.statusId === 1
                            ? 'geekblue'
                            : record.statusId === 2
                            ? 'green'
                            : record.statusId === 3
                            ? 'error'
                            : 'cyan'
                    }
                >
                    {record.invoiceStatus.toUpperCase()}
                </Tag>
            ),

            filters: [
                {
                    text: 'Chưa thanh toán',
                    value: 'Chưa thanh toán',
                },
                {
                    text: 'Đã thanh toán',
                    value: 'Đã thanh toán',
                },
            ],
            onFilter: (value, record) =>
                record.statusName.indexOf(value as string) === 0,
        },
        {
            title: 'Chức năng',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        className="me-2 text-white border-0 bg-info"
                        onClick={() => {
                            const queryParams = new URLSearchParams();
                            queryParams.append(
                                'appointment',
                                record.id.toString()
                            );
                            navigate(
                                `/admin/appointment-detail?${queryParams}`
                            );
                        }}
                    >
                        <EyeOutlined /> Chi tiết
                    </Button>
                    {record.statusId === 5 && (
                        <Button
                            className=" border-0 bg-primary text-white"
                            onClick={() => {
                                if (
                                    record.invoiceStatus === 'Chưa thanh toán'
                                ) {
                                    setIsUpdateInvoice(true);
                                }
                                setOpenInvoiceModal(true);
                                const params = new URLSearchParams();
                                params.append(
                                    'appointment',
                                    record.id.toString()
                                );
                                navigate(`/admin/appointment?${params}`);
                            }}
                        >
                            <PlusOutlined />
                            Chỉ định khám
                        </Button>
                    )}
                </>
            ),
        },
    ];

    useEffect(() => {
        const checkAppointments = async () => {
            console.log('chạy');

            if (!data?.appointments || ![2, 5].includes(options.status)) return;
            const now = dayjs();

            for (const appointment of data?.appointments) {
                const appointmentStartTime = dayjs(
                    `${appointment.appointmentDate.toString().split('T')[0]} ${
                        appointment.startTime
                    }`
                );
                const appointmentEndTime = dayjs(
                    `${appointment.appointmentDate.toString().split('T')[0]} ${
                        appointment.endTime
                    }`
                );

                if (
                    appointment.statusId === 2 &&
                    (now.isAfter(appointmentStartTime) ||
                        now.isSame(appointmentStartTime))
                ) {
                    updateAppointmentStatus(
                        {
                            appointment: { ...appointment, statusId: 5 },
                            requirementObject: 'doctor',
                        },
                        {
                            onSuccess() {
                                refetch();
                            },
                            onError(err: any) {
                                console.log(
                                    'Có lỗi khi cập nhật trạng thái lịch hẹn',
                                    err
                                );
                            },
                        }
                    );
                }

                if (
                    appointment.statusId === 5 &&
                    (now.isAfter(appointmentEndTime) ||
                        now.isSame(appointmentEndTime))
                ) {
                    updateAppointmentStatus(
                        {
                            appointment: { ...appointment, statusId: 4 },
                            requirementObject: 'doctor',
                        },
                        {
                            onSuccess() {
                                refetch();
                            },
                            onError(err: any) {
                                console.log(
                                    'Có lỗi khi cập nhật trạng thái lịch hẹn',
                                    err
                                );
                            },
                        }
                    );
                }
            }
        };

        checkAppointments();
        const interval = setInterval(checkAppointments, 60000);
        return () => {
            console.log('clear interval', interval);
            clearInterval(interval);
        };
    }, [data, options.status, refetch]);
    return (
        <>
            {contextHolder}
            <Row gutter={24} className="mb-3">
                <Col span={12} className="d-flex">
                    {tabs.map((tab) => {
                        return (
                            <Button
                                type={
                                    options.status === Number(tab.key)
                                        ? 'primary'
                                        : 'default'
                                }
                                className="me-2 col-3"
                                onClick={() => {
                                    if (
                                        Number(options.status) !==
                                        Number(tab.key)
                                    ) {
                                        setOptions({
                                            ...options,
                                            status: Number(tab.key),
                                        });
                                    }
                                }}
                                key={tab.key}
                            >
                                {tab.label}{' '}
                                <Tag className="rounded-5">
                                    {' '}
                                    {tab.key === '1'
                                        ? totalAppointment?.pendingCount
                                        : tab.key === '2'
                                        ? totalAppointment?.confirmedCount
                                        : tab.key === '3'
                                        ? totalAppointment?.cancelledCount
                                        : tab.key === '4'
                                        ? totalAppointment?.completedCount
                                        : totalAppointment?.inProgress}
                                </Tag>
                            </Button>
                        );
                    })}
                </Col>
                <Col span={12} className="text-end">
                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        value={[options.fromDate, options.toDate]}
                        format={'DD-MM-YYYY'}
                        onChange={onDateRangeChange}
                    />
                </Col>
            </Row>
            <Skeleton active loading={isFetching || isRefetching}>
                {isError ? (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không có dữ liệu !'
                            : 'Có lỗi khi lấy dữ liệu !'}
                    </p>
                ) : (
                    <>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={data?.appointments}
                            pagination={false}
                        />
                        <Pagination
                            className="mt-3"
                            showSizeChanger
                            align="center"
                            defaultCurrent={1}
                            current={data?.pageIndex}
                            pageSize={data?.pageSize}
                            total={
                                data?.pageCount
                                    ? data?.pageCount * data?.pageSize
                                    : 1
                            }
                            pageSizeOptions={['5', '10', '20', '50']}
                            onChange={onChangePage}
                        />
                    </>
                )}
            </Skeleton>
            {openInvoiceModal && (
                <InvoiceModal
                    openInvoiceModal={openInvoiceModal}
                    openMessage={openMessage}
                    cancelInvoiceModal={cancelInvoiceModal}
                    isUpdate={true}
                />
            )}
        </>
    );
};

export default AppointmentsTable;
