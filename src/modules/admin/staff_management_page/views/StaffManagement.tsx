import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Divider,
    message,
    Flex,
    Skeleton,
    Pagination,
} from 'antd';
import StaffTable from '../components/StaffTable';
import { useState } from 'react';
import InputStaffModal from '../components/InputStaffModal';
import { NoticeType } from 'antd/es/message/interface';
import { useFetchSupportStaffs } from '../../../../hooks/support_staff';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

const StaffManagement = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [api, contextHolder] = message.useMessage();
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const closeModal = () => {
        if (isUpdate) {
            setIsUpdate(false);
            queryClient.removeQueries({
                queryKey: [
                    'useFetchSupportStaffById',
                    searchParams.get('employee'),
                ],
            });
            navigate('/admin/support-staff');
        }
        setOpenInputModal(false);
    };
    const openMessage = (type: NoticeType, content: string) => {
        api.open({
            type,
            content,
        });
    };
    const [options, setOptions] = useState<{
        pageIndex: number;
        pageSize: number;
        searchContent?: string | null;
    }>({
        pageIndex: 1,
        pageSize: 10,
        searchContent: null,
    });
    const handleClickEditButton = () => {
        setOpenInputModal(true);
        setIsUpdate(true);
    };

    const { data, isFetching, isError, error, isRefetching, refetch } =
        useFetchSupportStaffs(options);
    return (
        <div>
            {contextHolder}
            <Flex justify="space-between" align="center">
                <Breadcrumb
                    items={[
                        {
                            href: '/',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Nhân viên hỗ trợ',
                        },
                    ]}
                />
                <Button
                    type="primary"
                    onClick={() => {
                        setOpenInputModal(true);
                    }}
                >
                    Thêm mới <PlusOutlined />
                </Button>
            </Flex>
            <Divider></Divider>

            <div></div>
            <Skeleton active loading={isFetching || isRefetching}>
                {!isError ? (
                    <>
                        <StaffTable
                            supportStaffs={data?.supportStaffs}
                            handleClickEditButton={handleClickEditButton}
                            openMessage={openMessage}
                            refetch={refetch}
                        />
                        <Pagination
                            align="center"
                            className="mt-3"
                            pageSize={options.pageSize}
                            current={options.pageIndex}
                            total={options.pageSize * data?.pageCount}
                        />
                    </>
                ) : (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không có dữ liệu !'
                            : 'Có lỗi khi lấy dữ liệu ! Vui lòng thử lại sau!'}
                    </p>
                )}
            </Skeleton>

            {openInputModal && (
                <InputStaffModal
                    openModal={openInputModal}
                    closeModal={closeModal}
                    isUpdate={isUpdate}
                    openMessage={openMessage}
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default StaffManagement;
