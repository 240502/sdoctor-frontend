import { useEffect, useRef, useState } from 'react';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';
import {
    AppointmentResponseDto,
    AppointmentViewForPatient,
} from '../../../../models/appointment';
import { appointmentStatusService } from '../../../../services';
import {
    Button,
    Col,
    Input,
    InputRef,
    Pagination,
    Row,
    Select,
    Skeleton,
    Space,
    Table,
    Tag,
    Tooltip,
    DatePicker,
    message,
} from 'antd';
import { TableColumnsType } from 'antd';
import {
    CloseOutlined,
    DollarOutlined,
    EditOutlined,
    EyeOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { ModalConfirmCancelAppointment } from '../components/ModalConfirmCancelAppointment';
import { useNavigate } from 'react-router-dom';
import { AppointmentStatus } from '../../../../models/appointment_status';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '@/assets/scss/patient_profile.scss';
import dayjs, { Dayjs } from 'dayjs';
import { ViewAppointmentModal } from '../../../../components';
import { useFetchAppointmentByUuid } from '../../../../hooks/appointments/useFetchAppointmentByUuid';
import { useCreatePayment } from '../../../../hooks';
type DataIndex = keyof AppointmentViewForPatient;
const { Option } = Select;
const { RangePicker } = DatePicker;
import 'dayjs/locale/vi';
import isoWeek from 'dayjs/plugin/isoWeek';
import { NoticeType } from 'antd/es/message/interface';
import { InputCommentModal } from '../components/InputCommentModal';
import { useCreateVnpay } from '../../../../hooks/payment/useCreateVnpay';
dayjs.extend(isoWeek);
dayjs.locale('vi');
const ViewAppointment = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    const [isView, setIsView] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpenModalConfirm, setIsOpenModalConfirm] =
        useState<boolean>(false);
    const [openInputCommentModal, setOpenInputCommentModal] =
        useState<boolean>(false);
    const patientProfile = useRecoilValue(patientProfileValue);
    const [appointment, setAppointment] = useState<AppointmentResponseDto>(
        {} as AppointmentResponseDto
    );
    const [appointmentStatuses, setAppointmentStatuses] = useState<
        AppointmentStatus[]
    >([]);
    const [options, setOptions] = useState<{
        statusId: number;
        pageIndex: number;
        pageSize: number;
        uuid: [];
        fromDate: Dayjs;
        toDate: Dayjs;
    }>({
        statusId: 1,
        pageIndex: 1,
        pageSize: 8,
        uuid: JSON.parse(localStorage.getItem('uuids') || '[]'),
        fromDate: dayjs().startOf('isoWeek'),
        toDate: dayjs().endOf('isoWeek'),
    });

    const { data, error, isFetching, refetch, isRefetching } =
        useFetchAppointmentByUuid(options);

    // const createPayment = useCreatePayment();
    const { mutate: createPayment } = useCreateVnpay();
    const getAllAppointmentStatus = async () => {
        try {
            const res = await appointmentStatusService.getAll();
            console.log(res);
            setAppointmentStatuses(res);
        } catch (err: any) {
            setAppointmentStatuses([]);

            console.log(err.message);
        }
    };
    const onChangePage = (current: number, size: number) => {
        if (Number(size) !== options.pageSize) {
            setOptions({ ...options, pageIndex: 1, pageSize: size });
        } else {
            setOptions({ ...options, pageIndex: current });
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
    const handleCancelInputModal = () => {
        setOpenInputCommentModal(false);
    };
    const columns: TableColumnsType<AppointmentResponseDto> = [
        {
            title: 'Bác sĩ',
            className: 'patient-name',
            dataIndex: 'doctorName',
            ...getColumnSearchProps('doctorName'),
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointmentDate',
            render: (_, record) => (
                <>{dayjs(record.appointmentDate).format('DD-MM-YYYY')}</>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'timeValue',
            render: (_, record) => (
                <>{record.startTime + '-' + record.endTime}</>
            ),
        },
        {
            title: 'Trạng thái lịch hẹn',
            className: 'status',
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
                    {record?.statusName?.toUpperCase()}
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
                record.statusName.indexOf(value as string) === 0,
        },
        {
            title: 'Trạng thái hóa đơn',
            className: 'status',

            dataIndex: 'invoice_status',
            render: (_, record) => (
                <Tag
                    color={
                        record.invoiceStatus === 'Đã thanh toán'
                            ? 'success'
                            : 'blue'
                    }
                >
                    {record?.invoiceStatus?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: AppointmentResponseDto) => {
                const appointmentTime = dayjs(
                    `${record.appointmentDate.toString().split('T')[0]} ${
                        record.startTime
                    }`,
                    'YYYY-MM-DD HH:mm'
                );

                const now = dayjs();
                const isPastOrCurrent =
                    now.isSame(appointmentTime) || now.isAfter(appointmentTime);

                return (
                    <Row gutter={24} className="">
                        <Col span={6}>
                            <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                                <Button
                                    className="mb-2 border border-info"
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        setAppointment(record);
                                        const queryParams =
                                            new URLSearchParams();
                                        queryParams.append(
                                            'appointment',
                                            record.id.toString()
                                        );
                                        navigate(
                                            `/patient/appointment?${queryParams}`
                                        );
                                    }}
                                >
                                    <EyeOutlined className="text-info" />
                                </Button>
                            </Tooltip>
                        </Col>
                        {!isPastOrCurrent && (
                            <>
                                {record.statusId === 4 && (
                                    <Col span={6} className="text-center">
                                        <Tooltip
                                            placement="topLeft"
                                            title={'Đặt lại'}
                                        >
                                            <Button
                                                className="mb-2"
                                                onClick={() => {
                                                    navigate(
                                                        '/doctor/detail/' +
                                                            record.doctorId
                                                    );
                                                }}
                                            >
                                                <RedoOutlined />
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                )}
                                {record.statusId === 1 && (
                                    <Col span={6}>
                                        <Tooltip
                                            placement="topLeft"
                                            title={'Hủy lịch hẹn'}
                                        >
                                            <Button
                                                className=""
                                                danger
                                                onClick={() => {
                                                    setIsOpenModalConfirm(true);
                                                    setAppointment(record);
                                                }}
                                            >
                                                <CloseOutlined className="text-danger" />
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                )}
                                {record.statusId === 4 &&
                                    record.isEvaluate === 0 && (
                                        <Col span={6}>
                                            <Tooltip
                                                title="Đánh giá"
                                                placement="top"
                                            >
                                                <Button
                                                    onClick={() => {
                                                        setOpenInputCommentModal(
                                                            true
                                                        );
                                                        setAppointment(record);
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    )}
                                {record.invoiceStatus === 'Chưa thanh toán' &&
                                    record.paymentMethod === 2 && (
                                        <Col span={6}>
                                            <Tooltip
                                                placement="topLeft"
                                                title={'Thanh toán'}
                                            >
                                                <Button
                                                    className=""
                                                    onClick={() => {
                                                        createPayment(
                                                            record.id
                                                        );
                                                    }}
                                                >
                                                    <DollarOutlined className="" />
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    )}
                            </>
                        )}
                    </Row>
                );
            },
        },
    ];

    const handleCancelModal = () => {
        setIsModalOpen(false);
        navigate(`/patient/appointment`);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
        setAppointment({} as AppointmentResponseDto);
    };

    const openNotification = (
        type: NoticeType,

        content: string
    ) => {
        messageApi.open({ type, content });
    };
    // Sửa hàm onDateRangeChange để khớp với chữ ký của RangePicker
    const onDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setOptions({ ...options, fromDate: dates[0], toDate: dates[1] });
        } else {
            setOptions({
                ...options,
                fromDate: dayjs().startOf('isoWeek'),
                toDate: dayjs().endOf('isoWeek'),
            });
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllAppointmentStatus();
    }, []);

    return (
        <PatientProfileLayout breadcrumb={'Lịch hẹn'}>
            <Row gutter={24} className="mb-3 ">
                {contextHolder}
                <Col span={12}>
                    <Select
                        className="w-25"
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
                {error ? (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không có lịch hẹn nào!'
                            : 'Có lỗi vui lòng thử lại sau!'}
                    </p>
                ) : (
                    <>
                        <Table<AppointmentResponseDto>
                            className="table-appointment"
                            bordered
                            columns={columns}
                            dataSource={data?.appointments}
                            pagination={false}
                        />
                        <Pagination
                            pageSize={data?.pageSize}
                            current={data?.pageIndex}
                            total={
                                data?.appointments
                                    ? data?.pageCount * data?.pageSize
                                    : 0
                            }
                            align="center"
                            className="mt-3"
                            showSizeChanger
                            pageSizeOptions={['5', '10', '20', '30']}
                            onChange={onChangePage}
                        />
                        {isModalOpen && (
                            <ViewAppointmentModal
                                openModal={isModalOpen}
                                cancelModal={handleCancelModal}
                            />
                        )}
                        {isOpenModalConfirm && (
                            <ModalConfirmCancelAppointment
                                isOpenModalConfirm
                                handleCancelModalConfirm={
                                    handleCancelModalConfirm
                                }
                                appointment={appointment}
                                setIsOpenModalConfirm={setIsOpenModalConfirm}
                                openNotification={openNotification}
                                refetch={refetch}
                            />
                        )}
                        {openInputCommentModal && (
                            <InputCommentModal
                                openInputModal={openInputCommentModal}
                                handleCancelInputModal={handleCancelInputModal}
                                appointment={appointment}
                                openNotification={openNotification}
                                refetch={refetch}
                            />
                        )}
                    </>
                )}
            </Skeleton>
        </PatientProfileLayout>
    );
};
export default ViewAppointment;
