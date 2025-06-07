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
    Divider,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import { ConfirmAppointmentModal } from '../../../../components';
import { useFetchAppointmentWithOptions } from '../../../../hooks/appointments/useFetchAppointmentWithOptions';
type DataIndex = keyof AppointmentResponseDto;
const { RangePicker } = DatePicker;
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi'; // Nếu cần định dạng ngày bằng tiếng Việt
import isoWeek from 'dayjs/plugin/isoWeek'; // Plugin để làm việc với tuần ISO
// Kích hoạt plugin isoWeek
dayjs.extend(isoWeek);
// Thiết lập locale tiếng Việt
dayjs.locale('vi');
import {
    useSendConfirmSuccessMail,
    useSendRejectionSuccessMail,
    useUpdateAppointmentStatus,
} from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
import { TabsProps } from 'antd/lib';
import { useFetchTotalAppointmentByStatus } from '../../../../hooks/appointments/useAppointment';
interface AppointmentTable {
    openMessage: (type: NoticeType, content: string) => void;
    userId: number;
}
const AppointmentTable = ({ openMessage, userId }: AppointmentTable) => {
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: <h6 className="m-0">Chờ xác nhận</h6>,
        },
        {
            key: '2',
            label: <h6 className="m-0">Chờ khám</h6>,
        },
        {
            key: '3',
            label: <h6 className="m-0">Đã hủy</h6>,
        },
    ];
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<AppointmentResponseDto>(
        {} as AppointmentResponseDto
    );
    const [options, setOptions] = useState<{
        pageIndex: number;
        pageSize: number;
        status: number;
        userId: number;
        appointmentDate: Dayjs;
    }>({
        userId: userId,
        pageIndex: 1,
        pageSize: 8,
        status: 1,
        appointmentDate: dayjs(),
    });
    const [type, setType] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const handleCancelModalConfirm = () => {
        setAppointment({} as AppointmentResponseDto);
        setOpenModalConfirm(false);
    };
    const rejectionReasonInputRef = useRef<any>(null);
    const { data, error, isError, isFetching, refetch, isRefetching } =
        useFetchAppointmentWithOptions(options);
    const {
        data: totalAppointment,
        refetch: refetchingTotalAppointmentByStatus,
    } = useFetchTotalAppointmentByStatus({
        doctorId: options.userId,
        appointmentDate: options.appointmentDate.format('YYYY-MM-DD'),
    });
    const updateAppointmentStatus = useUpdateAppointmentStatus();
    const sendRejectionMail = useSendRejectionSuccessMail();
    const sendConfirmSuccessMail = useSendConfirmSuccessMail();

    const handleOk = () => {
        let payload: any = {};
        if (type === 'delete') {
            payload = {
                appointment: {
                    ...appointment,
                    rejectionReason:
                        rejectionReasonInputRef.current?.resizableTextArea
                            ?.textArea.value,
                },
                requirementObject: 'doctor',
            };
        } else {
            payload = {
                appointment: {
                    ...appointment,
                },
                requirementObject: 'doctor',
            };
        }
        updateAppointmentStatus.mutate(payload, {
            onSuccess() {
                openMessage('success', 'Cập nhập trạng thái thành công!');
                handleCancelModalConfirm();
                if (type === 'delete') {
                    const payload = {
                        email: appointment.patientEmail,
                        doctorName: appointment.doctorName,
                        patientName: appointment.patientName,
                        date: dayjs(
                            appointment.appointmentDate.toString().split('T')[0]
                        ).format('DD-MM-YYYY'),
                        rejectionReason:
                            rejectionReasonInputRef.current?.resizableTextArea
                                ?.textArea.value,
                        requirementObject: 'doctor',
                    };
                    sendRejectionMail.mutate(payload);
                } else {
                    const payload = {
                        patientName: appointment.patientName,
                        email: appointment.patientEmail,
                        doctorName: appointment.doctorName,
                        date: dayjs(
                            appointment.appointmentDate.toString().split('T')[0]
                        ).format('DD-MM-YYYY'),
                        time: `${appointment.startTime} - ${appointment.endTime}`,
                        location: appointment.location,
                    };
                    sendConfirmSuccessMail.mutate(payload);
                }
                refetch();
                refetchingTotalAppointmentByStatus();
            },
            onError() {
                openMessage('error', 'Cập nhập trạng thái không thành công!');
                handleCancelModalConfirm();
            },
        });
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
            title: 'Trạng thái',
            dataIndex: 'statusName',
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
                    {record.statusName.toUpperCase()}
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
                        className="me-2 text-success border-0"
                        onClick={() => {
                            setOpenModalConfirm(true);
                            setType('confirm');
                            if (record.statusId === 2) {
                                setAppointment({
                                    ...record,
                                    statusId: 4,
                                });
                                setMessage(
                                    'Bạn chắc chắn xác nhận lịch hẹn này đã hoàn thành!'
                                );
                            } else {
                                setAppointment({
                                    ...record,
                                    statusId: 2,
                                });
                                setMessage(
                                    'Bạn chắc chắn xác nhận lịch hẹn này!'
                                );
                            }
                        }}
                    >
                        <CheckOutlined />{' '}
                        {record.statusId === 2 ? 'Hoàn thành' : 'Xác nhấn'}
                    </Button>
                    {record.statusId === 1 && (
                        <>
                            <Divider type="vertical" className="pt-3 pb-3" />
                            <Button
                                className="text-danger border-0  "
                                onClick={() => {
                                    setOpenModalConfirm(true);
                                    setAppointment({ ...record, statusId: 3 });
                                    setMessage(
                                        'Bạn chắc chắn hủy lịch hẹn này!'
                                    );
                                    setType('delete');
                                }}
                            >
                                <CloseOutlined className="text-danger" /> Từ
                                chối
                            </Button>
                        </>
                    )}
                </>
            ),
        },
    ];
    const onChangePage = (current: number, size: number) => {
        if (Number(size) !== options.pageSize) {
            setOptions({ ...options, pageIndex: 1, pageSize: size });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
    };
    const onDateRangeChange = (date: Dayjs) => {
        if (date) {
            setOptions({ ...options, appointmentDate: date });
        } else {
            setOptions({
                ...options,
                appointmentDate: dayjs(),
            });
        }
    };

    return (
        <>
            <Row gutter={24} className="mb-3">
                <Col span={12}>
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
                                <Tag className="rounded-5 fw-medium">
                                    {' '}
                                    {tab.key === '1'
                                        ? totalAppointment?.pendingCount
                                        : tab.key === '2'
                                        ? totalAppointment?.confirmedCount
                                        : tab.key === '3'
                                        ? totalAppointment?.cancelledCount
                                        : totalAppointment?.completedCount}
                                </Tag>
                            </Button>
                        );
                    })}
                </Col>
                <Col span={12} className="text-end">
                    <DatePicker
                        placeholder={'Chọn ngày'}
                        value={options.appointmentDate}
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
                        {openModalConfirm && (
                            <ConfirmAppointmentModal
                                type={type}
                                message={message}
                                openModalConfirm={openModalConfirm}
                                handleCancelModalConfirm={
                                    handleCancelModalConfirm
                                }
                                handleOk={handleOk}
                                rejectionReasonInputRef={
                                    rejectionReasonInputRef
                                }
                            />
                        )}
                    </>
                )}
            </Skeleton>
        </>
    );
};

export default AppointmentTable;
