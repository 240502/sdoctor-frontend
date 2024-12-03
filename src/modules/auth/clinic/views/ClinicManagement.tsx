import { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { ClinicService } from '../../../../services/clinicService';
import { Breadcrumb, Button, Divider, Flex, notification } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { ClinicCards } from '../components/ClinicCards';
import { InputClinicModal } from '../components/InputClinicModal';
import { useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { ConfirmModal } from '../../../../components';

type NotificationType = 'success' | 'error';
const ClinicManagement = () => {
    const config = useRecoilValue(configValue);
    const [api, contextHolder] = notification.useNotification();
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageCount, setPageCount] = useState<number>(0);
    const [clinic, setClinic] = useState<Clinic>({} as Clinic);
    const [openModalInputClinic, setOpenModalInputClinic] =
        useState<boolean>(false);
    const [openModalConfirmDelete, setOpenModalConfirmDelete] =
        useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const handleCancelModalConfirm = () => {
        setOpenModalConfirmDelete(false);
        setClinic({} as Clinic);
    };
    const DeleteClinic = async () => {
        try {
            const res = await ClinicService.deleteClinic(clinic?.id, config);
            console.log(res);
            openNotification('success', 'Thông báo', 'Xóa thành công!');
            handleCancelModalConfirm();
            getClinics();
        } catch (err: any) {
            console.log(err.message);
            handleCancelModalConfirm();
            openNotification('success', 'Thông báo', 'Xóa thành công!');
        }
    };
    const handleClickEditBtn = (clinic: Clinic) => {
        setClinic(clinic);
        setIsUpdate(true);
        setOpenModalInputClinic(true);
        console.log('clinic', clinic);
    };
    const handleClickDeleteBtn = (clinic: Clinic) => {
        setClinic(clinic);
        setOpenModalConfirmDelete(true);
    };

    const openNotification = (
        type: NotificationType,
        title: string,
        description: string
    ) => {
        api[type]({
            message: title,
            description: description,
        });
    };

    const handleCloseInputModal = () => {
        setOpenModalInputClinic(false);
        setClinic({} as Clinic);
        setIsUpdate(false);
    };
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    const getClinics = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
            };
            const res = await ClinicService.viewClinic(data);
            console.log(res);
            setClinics(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setClinics([]);
            setPageCount(0);
        }
    };
    useEffect(() => {
        getClinics();
    }, [pageIndex, pageSize]);
    return (
        <div className="container">
            {contextHolder}
            <div>
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Cơ sở y tế' },
                    ]}
                />
            </div>
            <Divider />
            <div className="block-clinics">
                <Flex className="justify-content-end ps-2 pe-2 mb-3 ">
                    <Button
                        className="border-0 text-white bg-primary"
                        onClick={() => setOpenModalInputClinic(true)}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                </Flex>
                <ClinicCards
                    clinics={clinics}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    changePage={changePage}
                    pageCount={pageCount}
                    handleClickEditBtn={handleClickEditBtn}
                    handleClickDeleteBtn={handleClickDeleteBtn}
                    openNotification={openNotification}
                />
            </div>
            {openModalInputClinic && (
                <InputClinicModal
                    openModalInputClinic={openModalInputClinic}
                    handleCloseInputModal={handleCloseInputModal}
                    isUpdate={isUpdate}
                    clinic={clinic}
                    setClinic={setClinic}
                    config={config}
                    openNotification={openNotification}
                    getClinics={getClinics}
                />
            )}
            {openModalConfirmDelete && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa cơ sở y tế này?"
                    openModal={openModalConfirmDelete}
                    handleCancelModal={handleCancelModalConfirm}
                    handleOk={DeleteClinic}
                />
            )}
        </div>
    );
};

export default ClinicManagement;
