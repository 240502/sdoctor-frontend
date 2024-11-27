import Table, { ColumnsType } from 'antd/es/table';
import { AppointmentViewForPatient } from '../../../../models/appointment';
import {
    App,
    Button,
    Input,
    InputRef,
    Pagination,
    Space,
    Tag,
    Tooltip,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { AppointmentService } from '../../../../services/appointmentService';
type DataIndex = keyof AppointmentViewForPatient;
const AppointmentTable = ({
    data,
    onPageChange,
    pageCount,
    pageIndex,
    pageSize,
    setPageSize,
    handleClickViewDetail,
    handleClickRejectBtn,
    openNotificationWithIcon,
    fetchData,
}: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleConfirmAppointment = async (id: number) => {
        try {
            const res = await AppointmentService.confirmAppointment(id);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Xác nhận lịch hẹn thành công!'
            );
            fetchData();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Xác nhậ lịch hẹn không thành công!'
            );
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
    const columns: ColumnsType<AppointmentViewForPatient> = [
        {
            title: 'Họ và tên',
            dataIndex: 'patient_name',
            ...getColumnSearchProps('patient_name'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'patient_phone',
            ...getColumnSearchProps('patient_phone'),
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
            dataIndex: 'status_name',
            render: (_, record) => (
                <Tag color={record.status_id === 1 ? 'geekblue' : 'green'}>
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
            ],
            onFilter: (value, record) =>
                record.status_name.indexOf(value as string) === 0,
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
                                handleClickViewDetail(record);
                            }}
                        >
                            <EyeOutlined className="text-info" />
                        </Button>
                    </Tooltip>
                    {record.status_id === 1 && (
                        <Tooltip placement="top" title="Xác nhận">
                            <Button
                                className="border-success me-2"
                                onClick={() => {
                                    handleConfirmAppointment(record.id);
                                }}
                            >
                                <CheckOutlined className="text-success" />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip placement="top" title="Từ chối">
                        <Button
                            danger
                            onClick={() => {
                                handleClickRejectBtn(record);
                            }}
                        >
                            <CloseOutlined className="text-danger" />
                        </Button>{' '}
                    </Tooltip>
                </>
            ),
        },
    ];

    return data.length > 0 ? (
        <>
            <Table
                bordered
                columns={columns}
                dataSource={data}
                pagination={false}
            />
            <Pagination
                align="center"
                className="mt-3"
                current={pageIndex}
                pageSize={pageSize}
                total={pageCount * pageSize}
                onChange={onPageChange}
                showSizeChanger
                pageSizeOptions={['5', '10', '20', '50']}
                onShowSizeChange={(current, size) => setPageSize(size)}
            />
        </>
    ) : (
        <p className="text-center">Chưa có lịch hẹn!</p>
    );
};

export default AppointmentTable;
