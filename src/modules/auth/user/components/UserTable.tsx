import { useEffect } from 'react';

import {
    Table,
    Card,
    Button,
    Pagination,
    Image,
    Flex,
    Divider,
    Tooltip,
    Switch,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeFilled,
    EyeOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { User } from '../../../../models/user';
import { ColumnsType } from 'antd/es/table';
type DataIndex = keyof User;
export const UserTable = ({
    users,
    pageIndex,
    pageSize,
    pageCount,
    onPageChange,
}: any) => {
    const onChangeSwitch = (checked: boolean) => {
        console.log('onChangeSwitch', checked);
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Họ và tên',
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
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (text) => {
                return <>{Number(text) === 1 ? 'Nam' : 'Nữ'}</>;
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },

        {
            title: 'Trạng thái tài khoản',
            key: 'account-status',
            render: (_, record) => {
                return <Switch checked={true} onChange={onChangeSwitch} />;
            },
        },
        {
            title: 'Chức năng',
            key: 'acton',
            render: (_, record) => {
                console.log(record?.password === null);
                return (
                    <>
                        <Tooltip placement="top" title={'Xem chi tiết'}>
                            <Button className="border-info me-2">
                                <EyeOutlined className="text-info" />
                            </Button>
                        </Tooltip>
                        {record?.password === null && (
                            <Tooltip placement="top" title="Tạo tài khoản">
                                <Button className="me-2 ">
                                    <UserAddOutlined className="" />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip placement="top" title="Reset mật khẩu">
                            <Button>
                                <UserSwitchOutlined />
                            </Button>
                        </Tooltip>
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
                <></>
            )}
        </>
    );
};
