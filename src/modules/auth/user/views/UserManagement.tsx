import { User } from 'ckeditor5-premium-features';
import { useEffect, useState } from 'react';
import { UserService } from '../../../../services/userService';
import { useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { notification, Breadcrumb, Divider, Flex, Button } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { UserTable } from '../components/UserTable';

type NotificationType = 'success' | 'error';
const UserManagement = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const header = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();

    const onPageChange = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageSize(size);
            setPageIndex(1);
        } else {
            setPageIndex(current);
        }
    };

    const openNotification = (
        type: NotificationType,
        title: string,
        message: string
    ) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const getUsers = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
            };
            const res = await UserService.viewUser(data, header);
            console.log(res);
            setUsers(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            setUsers([]);
            setPageCount(0);
            console.log(err.message);
        }
    };
    useEffect(() => {
        getUsers();
    }, [pageIndex, pageSize]);
    return (
        <div className="container user-management">
            {contextHolder}
            <div>
                <Breadcrumb
                    items={[
                        {
                            href: '/admin/dashboard',
                            title: <HomeOutlined></HomeOutlined>,
                        },
                        {
                            title: 'Người dùng',
                        },
                    ]}
                ></Breadcrumb>
            </div>
            <Divider></Divider>
            <Flex className="justify-content-between">
                <h5>Danh sách người dùng</h5>
            </Flex>
            <Divider></Divider>
            {/* <Flex></Flex> */}
            <UserTable
                users={users}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
        </div>
    );
};
export default UserManagement;
