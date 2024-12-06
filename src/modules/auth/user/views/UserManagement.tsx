import { useEffect, useState } from 'react';
import { UserService } from '../../../../services/userService';
import { useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { notification, Breadcrumb, Divider, Flex, Button, Select } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { UserTable } from '../components/UserTable';
import { UserAddModal } from '../components/AccountAddModal';
import { ConfirmModal } from '../../../../components';
import { User } from '../../../../models/user';

type NotificationType = 'success' | 'error';
const UserManagement = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const header = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [user, setUser] = useState<User>({} as User);
    const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
    const [active, setActive] = useState<number>(1);
    const [message, setMessage] = useState<string>('');
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [action, setAction] = useState<string>('');
    const onPageChange = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageSize(size);
            setPageIndex(1);
        } else {
            setPageIndex(current);
        }
    };

    const handleOpenConfirmModal = (
        user: User,
        message: string,
        action: string
    ) => {
        setOpenConfirmModal(true);
        setUser(user);
        setMessage(message);
        setAction(action);
    };
    const handleCancelConfirmModal = () => {
        setOpenConfirmModal(false);
        setUser({} as User);
    };
    const handleCloseModal = () => {
        setOpenAccountModal(false);
    };
    const onChangeSelectActiveStatus = (value: number) => {
        setActive(value);
    };

    const handleOpenAccountModal = (user: User) => {
        setUser(user);
        setOpenAccountModal(true);
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
                active: active,
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
    const updateUserActiveStatus = async () => {
        try {
            const data = {
                userId: user.user_id,
                active: active === 1 ? 0 : 1,
            };
            const res = await UserService.updateUserActiveStatus(data, header);
            console.log(res);
            openNotification(
                'success',
                'Thông báo',
                'Thay đổi trạng thái tài khoản thành công!'
            );
            handleCancelConfirmModal();
            getUsers();
        } catch (err: any) {
            console.log('error', err.message);
            openNotification(
                'error',
                'Thông báo',
                'Thay đổi trạng thái tài khoản không thành công!'
            );
            handleCancelConfirmModal();
        }
    };
    const resetPassword = async () => {
        try {
            const data = {
                userId: user.user_id,
            };
            const res = await UserService.resetPassword(data, header);
            console.log(res);
            openNotification(
                'success',
                'Thông báo',
                'Reset mật khẩu tài khoản thành công!'
            );
            handleCancelConfirmModal();
        } catch (err: any) {
            console.log('error', err.message);
            openNotification(
                'error',
                'Thông báo',
                'Reset mật khẩu tài khoản không thành công!'
            );
            handleCancelConfirmModal();
        }
    };

    useEffect(() => {
        getUsers();
    }, [pageIndex, pageSize, active]);
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
            <div className="filter-option mb-3">
                <Select
                    className="col-2"
                    value={active}
                    onChange={onChangeSelectActiveStatus}
                >
                    <Select.Option value={1} key={1} label="Hoạt động">
                        Hoạt động
                    </Select.Option>
                    <Select.Option value={0} key={0}>
                        Bị khóa
                    </Select.Option>
                </Select>
            </div>
            <UserTable
                users={users}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                onPageChange={onPageChange}
                handleOpenAccountModal={handleOpenAccountModal}
                handleOpenConfirmModal={handleOpenConfirmModal}
            />
            {openAccountModal && (
                <UserAddModal
                    openAccountModal={openAccountModal}
                    handleCloseModal={handleCloseModal}
                    user={user}
                    openNotification={openNotification}
                    header={header}
                    getUsers={getUsers}
                />
            )}
            {openConfirmModal && (
                <ConfirmModal
                    message={message}
                    openModal={openConfirmModal}
                    handleCancelModal={handleCancelConfirmModal}
                    handleOk={
                        action === 'reset password'
                            ? resetPassword
                            : updateUserActiveStatus
                    }
                />
            )}
        </div>
    );
};
export default UserManagement;
