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
    notification,
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
type NotificationType = 'success' | 'error';
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
import 'dayjs/locale/vi'; // Nếu cần định dạng ngày bằng tiếng Việt
import isoWeek from 'dayjs/plugin/isoWeek'; // Plugin để làm việc với tuần ISO
import { InputCommentModal } from '../components/InputCommentModal';
// Kích hoạt plugin isoWeek
dayjs.extend(isoWeek);
// Thiết lập locale tiếng Việt
dayjs.locale('vi');
const ViewAppointment = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    const [isView, setIsView] = useState<boolean>(false);
    const [api, contextHolder] = notification.useNotification();
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
        uuid: string;
        fromDate: Dayjs;
        toDate: Dayjs;
    }>({
        statusId: 1,
        pageIndex: 1,
        pageSize: 8,
        uuid: patientProfile.uuid,
        fromDate: dayjs().startOf('isoWeek'),
        toDate: dayjs().endOf('isoWeek'),
    });

    const { data, error, isFetching, refetch, isRefetching } =
        useFetchAppointmentByUuid(options);

    const createPayment = useCreatePayment();
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
            render: (text: string, record: AppointmentResponseDto) => (
                <Row gutter={24} className="">
                    {record.statusId === 4 && (
                        <Col span={6} className="text-center">
                            <Tooltip placement="topLeft" title={'Đặt lại'}>
                                <Button
                                    className="mb-2"
                                    onClick={() => {
                                        navigate(
                                            '/doctor/detail/' + record.doctorId
                                        );
                                    }}
                                >
                                    <RedoOutlined />
                                </Button>
                            </Tooltip>
                        </Col>
                    )}
                    <Col span={6}>
                        <Tooltip placement="topLeft" title={'Xem chi tiết'}>
                            <Button
                                className="mb-2 border border-info"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setAppointment(record);
                                    setIsView(true);
                                }}
                            >
                                <EyeOutlined className="text-info" />
                            </Button>
                        </Tooltip>
                    </Col>
                    {record.statusId === 1 && (
                        <Col span={6}>
                            <Tooltip placement="topLeft" title={'Hủy lịch hẹn'}>
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
                    {record.statusId === 4 && record.isEvaluate === 0 && (
                        <Tooltip title="Đánh giá" placement="top">
                            <Button
                                onClick={() => {
                                    setOpenInputCommentModal(true);
                                    setAppointment(record);
                                }}
                            >
                                <EditOutlined />
                            </Button>
                        </Tooltip>
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
                                            console.log(record);
                                            // getInvoiceByAppointment(record.id);
                                            createPayment.mutate(record.id);
                                        }}
                                    >
                                        <DollarOutlined className="" />
                                    </Button>
                                </Tooltip>
                            </Col>
                        )}
                </Row>
            ),
        },
    ];

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
        setAppointment({} as AppointmentResponseDto);
    };
    const handleCancelModalInput = () => {
        setOpenInputCommentModal(false);
        setAppointment({} as AppointmentResponseDto);
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
    // Sửa hàm onDateRangeChange để khớp với chữ ký của RangePicker
    const onDateRangeChange = (
        dates: [Dayjs | null, Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
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
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllAppointmentStatus();
    }, []);
    useEffect(() => {
        console.log('appointment', appointment);
    }, [appointment]);
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
                    <p className="fw-bold text-center">{error.message}</p>
                ) : (
                    <>
                        {' '}
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
                                handleCancelModal={handleCancelModal}
                                isModalOpen
                                appointment={appointment}
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
                                openNotificationWithIcon={
                                    openNotificationWithIcon
                                }
                                refetch={refetch}
                            />
                        )}
                        {openInputCommentModal && (
                            <InputCommentModal
                                openInputModal={openInputCommentModal}
                                handleCancelInputModal={handleCancelInputModal}
                                appointment={appointment}
                            />
                        )}
                    </>
                )}
            </Skeleton>
        </PatientProfileLayout>
    );
};
export default ViewAppointment;
