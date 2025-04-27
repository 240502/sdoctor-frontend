import Table, { ColumnsType } from 'antd/es/table';
import { AppointmentResponseDto } from '../../../../models/appointment';
import { Button, Input, InputRef, Skeleton, Space, Tag, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { ConfirmAppointmentModal } from '../../../../components';

import {
    useFetchAppointmentsInDay,
    useSendConfirmSuccessMail,
    useSendRejectionSuccessMail,
    useUpdateAppointmentStatus,
} from '../../../../hooks';
import dayjs from 'dayjs';
import AppointmentDetailModal from './AppointmentDetailModal';
type DataIndex = keyof AppointmentResponseDto;
type NotificationType = 'success' | 'error';
interface AppointmentTableProps {
    doctorId: number;
    openNotification: (
        type: NotificationType,
        title: string,
        des: string
    ) => void;
}
const AppointmentTable: React.FC<AppointmentTableProps> = ({
    doctorId,
    openNotification,
}: AppointmentTableProps): JSX.Element => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<AppointmentResponseDto>(
        {} as AppointmentResponseDto
    );
    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [type, setType] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const handleCancelModalConfirm = () => {
        setAppointment({} as AppointmentResponseDto);
        setOpenModalConfirm(false);
    };
    const rejectionReasonInputRef = useRef<any>(null);
    const updateAppointmentStatus = useUpdateAppointmentStatus();
    const sendRejectionMail = useSendRejectionSuccessMail();
    const sendConfirmSuccessMail = useSendConfirmSuccessMail();
    const {
        data: appointmentsResponse,
        isError,
        error,
        isFetching,
        refetch,
        isRefetching,
    } = useFetchAppointmentsInDay(doctorId);
    useEffect(() => {}, [appointmentsResponse]);
    const cancelDetailModal = () => {
        setIsOpenDetailModal(false);
    };

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
                openNotification(
                    'success',
                    'Thông báo!',
                    'Cập nhập trạng thái thành công!'
                );
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
            },
            onError() {
                openNotification(
                    'error',
                    'Thông báo!',
                    'Cập nhập trạng thái không thành công!'
                );
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
            title: 'Trạng thái',
            dataIndex: 'statusName',
            render: (_, record) => (
                <Tag color={record.statusId === 1 ? 'geekblue' : 'green'}>
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
                    <Tooltip placement="top" title="Xem chi tiết">
                        <Button
                            className="border-info me-2"
                            onClick={() => {
                                setIsOpenDetailModal(true);
                                setAppointment(record);
                            }}
                        >
                            <EyeOutlined className="text-info" />
                        </Button>
                    </Tooltip>
                    {(record.statusId === 2 || record.statusId === 1) && (
                        <Tooltip
                            placement="top"
                            title={
                                record.statusId === 1
                                    ? 'Xác nhận'
                                    : 'Hoàn thành'
                            }
                        >
                            <Button
                                className="border-success me-2"
                                onClick={() => {
                                    console.log(record);
                                    setOpenModalConfirm(true);
                                    setType('confirm');

                                    if (record.statusId === 2) {
                                        setAppointment({
                                            ...record,
                                            statusId: 4,
                                        });
                                        setMessage(
                                            'Bạn chắc chắn muốn đánh dấu lịch hẹn đã hoàn thành này!'
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
                                <CheckOutlined className="text-success" />
                            </Button>
                        </Tooltip>
                    )}
                    {(record.statusId === 2 || record.statusId === 1) && (
                        <Tooltip placement="top" title="Từ chối">
                            <Button
                                danger
                                onClick={() => {
                                    setOpenModalConfirm(true);
                                    //handleConfirmAppointment(record);
                                    setAppointment({ ...record, statusId: 3 });
                                    setMessage(
                                        'Bạn chắc chắn hủy lịch hẹn này!'
                                    );
                                    setType('delete');
                                }}
                            >
                                <CloseOutlined className="text-danger" />
                            </Button>{' '}
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            <Skeleton active loading={isFetching || isRefetching}>
                {isError ? (
                    <p>
                        {error.message.includes('404')
                            ? 'Không có lịch hẹn nào!'
                            : 'Có lỗi khi lấy dữ liệu !'}
                    </p>
                ) : (
                    <Table
                        bordered
                        columns={columns}
                        dataSource={appointmentsResponse}
                        pagination={false}
                    />
                )}
            </Skeleton>

            {openModalConfirm && (
                <ConfirmAppointmentModal
                    type={type}
                    message={message}
                    openModalConfirm={openModalConfirm}
                    handleCancelModalConfirm={handleCancelModalConfirm}
                    handleOk={handleOk}
                    rejectionReasonInputRef={rejectionReasonInputRef}
                />
            )}
            {isOpenDetailModal && (
                <AppointmentDetailModal
                    appointment={appointment}
                    isModalOpen={isOpenDetailModal}
                    cancelModal={cancelDetailModal}
                />
            )}
        </>
    );
};

export default AppointmentTable;
