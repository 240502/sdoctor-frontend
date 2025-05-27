import {
    Button,
    Col,
    Pagination,
    Row,
    Select,
    Table,
    Tooltip,
    Space,
    Input,
    InputRef,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Invoices } from '../../../../models/invoices';
import { invoicesService } from '../../../../services';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { ConfirmModal, ViewInvoiceModal } from '../../../../components';
import { useNavigate } from 'react-router-dom';
import { NoticeType } from 'antd/es/message/interface';
import { useUpdateInvoiceStatus } from '../../../../hooks';
import { useDeleteInvoice } from '../../../../hooks/invoice/useInvoice';

type DataIndex = keyof Invoices;
interface InvoiceTableProps {
    openNotification: (type: NoticeType, content: string) => void;
    handleClickUpdateButton: () => void;
    invoices: Invoices[];
    refetch: () => void;
}

export const InvoiceTable = ({
    openNotification,
    handleClickUpdateButton,
    invoices,
    refetch,
}: InvoiceTableProps) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openViewInvoiceModal, setOpenViewInvoiceModal] =
        useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<number | null>(null);
    const { mutate: deleteInvoice } = useDeleteInvoice();
    const { mutate: updateInvoiceStatus } = useUpdateInvoiceStatus();
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
    const closeModalConfirm = () => {
        setOpenConfirmModal(false);
        setDeletedId(null);
    };
    const handleConfirm = () => {
        deleteInvoice(deletedId, {
            onSuccess() {
                openNotification('success', 'Xóa thành công!');
                refetch();
            },
            onError() {
                openNotification('error', 'Xóa không thành công!');
            },
        });
    };

    const columns: ColumnsType<Invoices> = [
        {
            title: 'Bệnh nhân',
            dataIndex: 'patientName',
            ...getColumnSearchProps('patientName'),
        },
        {
            title: 'Ngày hẹn khám',
            dataIndex: 'appointmentDate',
            render(value, record, index) {
                const date = new Date(value.split('Z')[0]);
                return (
                    <>
                        {date.getDate() +
                            '-' +
                            (date.getMonth() + 1) +
                            '-' +
                            date.getFullYear()}
                    </>
                );
            },
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceName',
            ...getColumnSearchProps('serviceName'),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'amount',
            render(value, record, index) {
                return <>{record.amount.toLocaleString()} VNĐ</>;
            },
            sorter: (a, b) => {
                return a.amount - b.amount;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render(value, record, index) {
                return (
                    <Select
                        disabled={
                            record.status === 'Đã thanh toán' ? true : false
                        }
                        value={record.status}
                        className="w-100"
                        onChange={(value: string) => {
                            updateInvoiceStatus(
                                { id: record.id, status: value },
                                {
                                    onSuccess: () => {
                                        openNotification(
                                            'success',
                                            'Cập nhật trạng thái thành công'
                                        );
                                        refetch();
                                    },
                                    onError: (error: any) => {
                                        openNotification(
                                            'error',
                                            error.message ||
                                                'Cập nhật trạng thái không thành công'
                                        );
                                    },
                                }
                            );
                        }}
                    >
                        <Select.Option value="Đã thanh toán">
                            Đã thanh toán
                        </Select.Option>
                        <Select.Option value="Chưa thanh toán">
                            Chưa thanh toán
                        </Select.Option>
                    </Select>
                );
            },
        },
        {
            title: 'Chức năng',
            dataIndex: 'action',
            render(value, record, index) {
                return (
                    <Row gutter={24}>
                        <Col span={8}>
                            <Tooltip placement="top" title="Xem chi tiết">
                                <Button
                                    className="border-info text-info"
                                    onClick={() => {
                                        const queryParams =
                                            new URLSearchParams();

                                        queryParams.append(
                                            'invoice',
                                            record.id.toString()
                                        );
                                        navigate(
                                            `/admin/invoice?${queryParams}`
                                        );
                                        setOpenViewInvoiceModal(true);
                                    }}
                                >
                                    <EyeOutlined></EyeOutlined>
                                </Button>
                            </Tooltip>
                        </Col>
                        {record.status !== 'Đã thanh toán' && (
                            <>
                                {' '}
                                <Col span={8}>
                                    <Tooltip placement="top" title="Sửa">
                                        <Button
                                            onClick={() => {
                                                const queryParams =
                                                    new URLSearchParams();

                                                queryParams.append(
                                                    'invoice',
                                                    record.id.toString()
                                                );
                                                navigate(
                                                    `/admin/invoice?${queryParams}`
                                                );
                                                handleClickUpdateButton();
                                            }}
                                            className="text-success border-success"
                                        >
                                            <EditOutlined />
                                        </Button>
                                    </Tooltip>
                                </Col>
                                <Col span={8}>
                                    <Tooltip placement="top" title="Xóa">
                                        <Button
                                            className="text-danger border-danger"
                                            onClick={() => {
                                                setDeletedId(record.id);
                                                setOpenConfirmModal(true);
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip>
                                </Col>
                            </>
                        )}
                    </Row>
                );
            },
        },
    ];
    const cancelViewInvoiceModal = () => {
        setOpenViewInvoiceModal(false);
    };

    return (
        <>
            <Table
                pagination={false}
                bordered
                columns={columns}
                dataSource={invoices}
            ></Table>

            {openViewInvoiceModal && (
                <ViewInvoiceModal
                    openViewInvoiceModal={openViewInvoiceModal}
                    // invoice={invoice}
                    cancelViewInvoiceModal={cancelViewInvoiceModal}
                />
            )}
            {
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa hóa đơn này?"
                    isOpenModal={openConfirmModal}
                    onCloseModal={closeModalConfirm}
                    handleOk={handleConfirm}
                />
            }
        </>
    );
};
