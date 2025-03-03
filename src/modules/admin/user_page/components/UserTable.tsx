import { useEffect, useRef, useState } from 'react';

import {
    Table,
    Button,
    Pagination,
    Image,
    Flex,
    Tooltip,
    Switch,
    Space,
    Input,
    InputRef,
} from 'antd';
import {
    SearchOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { User } from '../../../../models/user';
import { ColumnsType } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';

import Highlighter from 'react-highlight-words';
import { UserService } from '../../../../services/userService';

type DataIndex = keyof User;
export const UserTable = ({
    users,
    pageIndex,
    pageSize,
    pageCount,
    onPageChange,
    handleOpenAccountModal,
    onChangeSwitch,
    handleOpenConfirmModal,
}: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

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

    const columns: ColumnsType<User> = [
        {
            title: 'Họ và tên',
            ...getColumnSearchProps('full_name'),
            render: (_, record) => {
                return (
                    <Flex className="align-items-center">
                        <div className="w-25">
                            <Image
                                src={record.image}
                                className=" rounded-circle"
                                preview={false}
                            ></Image>
                        </div>

                        <p className="ms-2 mb-0">{record.full_name}</p>
                    </Flex>
                );
            },
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ...getColumnSearchProps('address'),
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
            title: 'Trạng thái tài khoản',
            key: 'account-status',
            render: (_, record) => {
                return (
                    <Switch
                        checked={record?.active === 1 ? true : false}
                        onChange={(checked: boolean) => {
                            handleOpenConfirmModal(
                                record,
                                'Bạn chắc chắn muốn khóa tài khoản này?',
                                'update status'
                            );
                        }}
                    />
                );
            },
        },
        {
            title: 'Chức năng',
            key: 'acton',
            render: (_, record) => {
                console.log(record?.password === null);
                return (
                    <>
                        {record?.password === null && (
                            <Tooltip placement="top" title="Tạo tài khoản">
                                <Button
                                    className="me-2 border-primary"
                                    onClick={() =>
                                        handleOpenAccountModal(record)
                                    }
                                >
                                    <UserAddOutlined className="text-primary" />
                                </Button>
                            </Tooltip>
                        )}
                        {record?.password !== null && (
                            <Tooltip placement="top" title="Reset mật khẩu">
                                <Button
                                    className="border-warning"
                                    onClick={() => {
                                        handleOpenConfirmModal(
                                            record,
                                            'Bạn chắc chắn muốn reset mật khẩu tài khoản này?',
                                            'reset password'
                                        );
                                    }}
                                >
                                    <UserSwitchOutlined className="text-warning" />
                                </Button>
                            </Tooltip>
                        )}
                    </>
                );
            },
        },
    ];
    useEffect(() => {}, [users]);
    return (
        <>
            {users?.length > 0 ? (
                <>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={users}
                        pagination={false}
                    />
                    <Pagination
                        current={pageIndex}
                        pageSize={pageSize}
                        align="center"
                        className="mt-3"
                        onChange={onPageChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '15', '20']}
                        total={pageSize * pageCount}
                    />
                </>
            ) : (
                <p className="text-center"> Không có người dùng nào!</p>
            )}
        </>
    );
};
