import { useEffect, useRef, useState } from 'react';
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
    Col,
    Flex,
    Input,
    InputRef,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
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
import { ModalViewAppointment } from '../components/ModalViewAppointment';
import { ModalConfirmCancelAppointment } from '../components/ModalConfirmCancelAppointment';
import { useNavigate } from 'react-router-dom';
import { AppointmentStatus } from '../../../../models/appointment_status';
import { AppointmentStatusService } from '../../../../services/appointment_statusService';
type NotificationType = 'success' | 'error';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '@/assets/scss/patient_profile.scss';
import dayjs from 'dayjs';
import { invoicesService } from '../../../../services/invoicesService';
import { Invoices } from '../../../../models/invoices';
import { paymentService } from '../../../../services/paymentService';
import { InputCommentModal } from '../components/InputCommonModal';
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
    const [openInputCommentModal, setOpenInputCommentModal] =
        useState<boolean>(true);
    const patientProfile = useRecoilValue(patientProfileValue);
    const [appointment, setAppointment] = useState<Appointment>(
        {} as Appointment
    );
    const [appointmentStatuses, setAppointmentStatuses] = useState<
        AppointmentStatus[]
    >([]);
    const [options, setOptions] = useState<any>({ statusId: 1 });
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
    const getInvoiceByAppointment = async (appointmentId: number) => {
        try {
            const res = await invoicesService.getInvoiceByAppointmentId(
                appointmentId
            );
            console.log(res);
            handleCreateOnlinePayment(res);
        } catch (err: any) {}
    };
    const handleCreateOnlinePayment = async (invoice: Invoices) => {
        try {
            const res = await paymentService.create(invoice);
            console.log(res);
            window.location.href = res?.data?.order_url;
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleCancelInputModal = () => {
        setOpenInputCommentModal(false);
    };
    const columns: TableColumnsType<AppointmentViewForPatient> = [
        {
            title: 'Bác sĩ',
            className: 'patient-name',
            dataIndex: 'doctor_name',
            ...getColumnSearchProps('doctor_name'),
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointment_date',
            render: (_, record) => (
                <>{dayjs(record.appointment_date).format('DD-MM-YYYY')}</>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'time_value',
        },
        {
            title: 'Trạng thái lịch hẹn',
            className: 'status',
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
            title: 'Trạng thái hóa đơn',
            className: 'status',

            dataIndex: 'invoice_status',
            render: (_, record) => (
                <Tag
                    color={
                        record.invoice_status === 'Đã thanh toán'
                            ? 'success'
                            : 'blue'
                    }
                >
                    {record.invoice_status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Appointment) => (
                <Row gutter={24} className="">
                    {record.status_id === 4 && (
                        <Col span={6}>
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
                                    console.log('appointment', record);
                                }}
                            >
                                <EyeOutlined className="text-info" />
                            </Button>
                        </Tooltip>
                    </Col>
                    {record.status_id === 1 && (
                        <Col span={6}>
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
                        </Col>
                    )}
                    {record.status_id === 4 && record.isEvaluate === 0 && (
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
                    {record.invoice_status === 'Chưa thanh toán' &&
                        record.payment_method === 2 && (
                            <Col span={6}>
                                <Tooltip
                                    placement="topLeft"
                                    title={'Thanh toán'}
                                >
                                    <Button
                                        className=""
                                        onClick={() => {
                                            console.log(record);
                                            getInvoiceByAppointment(record.id);
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

    const getAppointmentByPatientPhone = async () => {
        const data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            phone: patientProfile.patient_phone,
            statusId: options.statusId,
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
            setAppointments([]);
            setPageCount(0);
        }
    };
    const handleCancelModal = () => {
        setIsModalOpen(false);
    };
    const handleCancelModalConfirm = () => {
        setIsOpenModalConfirm(false);
        setAppointment({} as Appointment);
    };
    const handleCancelModalInput = () => {
        setOpenInputCommentModal(false);
        setAppointment({} as Appointment);
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
    }, [pageIndex, pageSize, options]);
    useEffect(() => {
        window.scrollTo(0, 0);
        getAllAppointmentStatus();
    }, []);
    useEffect(() => {
        console.log('appointments', appointments);
    }, [appointments]);
    return (
        <PatientProfileLayout breadcrumb={'Lịch hẹn'}>
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
            {appointments?.length > 0 ? (
                <>
                    {contextHolder}{' '}
                    <Table<AppointmentViewForPatient>
                        className="table-appointment"
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
                    {openInputCommentModal && (
                        <InputCommentModal
                            openInputModal={openInputCommentModal}
                            handleCancelInputModal={handleCancelInputModal}
                            appointment={appointment}
                            setAppointments={setAppointments}
                            openNotificationWithIcon={openNotificationWithIcon}
                            handleCancelModalInput={handleCancelModalInput}
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
