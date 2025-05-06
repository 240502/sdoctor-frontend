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
import { useRef, useState } from 'react';
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
import { ViewInvoiceModal } from '../../../../components';

type DataIndex = keyof Invoices;

export const InvoiceTable = ({
    config,
    openNotification,
    onClickUpdateButton,
    pageIndex,
    pageSize,
    pageCount,
    invoices,
    getInvoices,
    changePage,
    onClickDeleteButton,
}: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [openViewInvoiceModal, setOpenViewInvoiceModal] =
        useState<boolean>(false);
    const [invoice, setInvoice] = useState<Invoices>({} as Invoices);
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
                            changeStatusInvoice(record.id, value);
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
                                        setInvoice(record);
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
                                                onClickUpdateButton(record);
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
                                                onClickDeleteButton(record);
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
        setInvoice({} as Invoices);
        setOpenViewInvoiceModal(false);
    };
    const changeStatusInvoice = async (id: number, status: string) => {
        try {
            const data = {
                id: id,
                status: status,
            };
            const res = await invoicesService.updateInvoiceStatus(data);

            getInvoices();
            openNotification(
                'success',
                'Thông báo',
                'Cập nhập trạng thái thành công'
            );
        } catch (err: any) {
            console.log(err.message);
            openNotification(
                'error',
                'Thông báo',
                'Cập nhập trạng thái không thành công'
            );
        }
    };

    return (
        <>
            <Table
                pagination={false}
                bordered
                columns={columns}
                dataSource={invoices}
            ></Table>
            {pageCount > 1 && (
                <Pagination
                    className="mt-3"
                    align="center"
                    showSizeChanger
                    pageSizeOptions={['5', '10', '15']}
                    current={pageIndex}
                    pageSize={pageSize}
                    total={pageCount * pageSize}
                    onChange={changePage}
                />
            )}
            {openViewInvoiceModal && (
                <ViewInvoiceModal
                    openViewInvoiceModal={openViewInvoiceModal}
                    invoice={invoice}
                    cancelViewInvoiceModal={cancelViewInvoiceModal}
                />
            )}
        </>
    );
};
