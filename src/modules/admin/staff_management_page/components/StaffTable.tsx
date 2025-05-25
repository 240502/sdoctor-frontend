import { ColumnsType } from 'antd/es/table';
import { SupportStaff } from '../../../../models/support_staff';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { useRef, useState } from 'react';
import { Button, Flex, Input, InputRef, Space } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Table } from 'antd/lib';

import { useNavigate } from 'react-router-dom';
import { NoticeType } from 'antd/es/message/interface';
import { useDeleteSupportStaff } from '../../../../hooks/support_staff';
import { ConfirmModal } from '../../../../components';

type DataIndex = keyof SupportStaff;

interface StaffTableProps {
    supportStaffs: SupportStaff[];
    handleClickEditButton: () => void;
    openMessage: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
const StaffTable = ({
    supportStaffs,
    handleClickEditButton,
    openMessage,
    refetch,
}: StaffTableProps) => {
    const [deletedId, setDeletedId] = useState<number | null>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const cancelConfirmModal = () => {
        setDeletedId(null);
        setOpenConfirmModal(false);
    };
    const { mutate: deleteSupportStaff } = useDeleteSupportStaff();
    const handleConfirm = () => {
        deleteSupportStaff(deletedId, {
            onSuccess() {
                openMessage('success', 'Xóa thành công!');
                refetch();
            },
            onError() {
                openMessage('success', 'Xóa không thành công!');
            },
        });
    };
    const navigate = useNavigate();
    const searchInput = useRef<InputRef>(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
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
    const columns: ColumnsType<SupportStaff> = [
        {
            title: 'Họ và tên',
            ...getColumnSearchProps('fullName'),
            render: (_, record) => {
                return <>{record.fullName}</>;
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (text) => {
                return <>{Number(text) === 1 ? 'Nam' : 'Nữ'}</>;
            },
            filters: [
                {
                    text: 'Nam',
                    value: 1,
                },
                {
                    text: 'Nữ',
                    value: 2,
                },
            ],
            onFilter: (value, record) => Number(record.gender) === value,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => {
                return text ?? '';
            },
        },

        {
            title: 'Chức năng',
            key: 'acton',
            render: (_, record) => {
                return (
                    <>
                        <Button
                            className="text-warning me-3 border-warning "
                            onClick={() => {
                                handleClickEditButton();
                                const queryParams = new URLSearchParams();

                                queryParams.append(
                                    'employee',
                                    record.employeeId.toString()
                                );
                                navigate(`/admin/support-staff?${queryParams}`);
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Button
                            className="text-danger  border-danger"
                            onClick={() => {
                                setDeletedId(record.userId);
                                setOpenConfirmModal(true);
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </>
                );
            },
        },
    ];
    return (
        <>
            <Table
                bordered
                columns={columns}
                dataSource={supportStaffs}
                pagination={false}
            />
            {openConfirmModal && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa gói khám này"
                    isOpenModal={openConfirmModal}
                    onCloseModal={cancelConfirmModal}
                    handleOk={handleConfirm}
                />
            )}
        </>
    );
};

export default StaffTable;
