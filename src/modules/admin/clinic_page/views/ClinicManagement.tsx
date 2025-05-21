import { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { clinicService, otherService } from '../../../../services';
import {
    Breadcrumb,
    Button,
    Divider,
    Flex,
    Input,
    message,
    Select,
    Skeleton,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { ClinicCards } from '../components/ClinicCards';
import { InputClinicModal } from '../components/InputClinicModal';
import { ConfirmModal } from '../../../../components';
import { ProvinceType } from '../../../../models/other';
import { SearchProps } from 'antd/es/input';
import { NoticeType } from 'antd/es/message/interface';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteClinic, useFetchClinicForAdmin } from '../../../../hooks';
const { Option } = Select;
const { Search } = Input;
const ClinicManagement = () => {
    const navigate = useNavigate();
    const { mutate: deleteClinic } = useDeleteClinic();
    const queryClient = useQueryClient();
    const [api, contextHolder] = message.useMessage();
    const [clinicId, setClinicId] = useState<number | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [clinic, setClinic] = useState<Clinic>({} as Clinic);
    const [openModalInputClinic, setOpenModalInputClinic] =
        useState<boolean>(false);
    const [openModalConfirmDelete, setOpenModalConfirmDelete] =
        useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [options, setOptions] = useState<any>({
        location: null,
        name: null,
    });
    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const getProvinces = async () => {
        try {
            const res = await otherService.getProvinces();
            setProvinces(res);
        } catch (err) {
            console.log(err);
        }
    };
    const handleCancelModalConfirm = () => {
        setOpenModalConfirmDelete(false);
        setClinic({} as Clinic);
    };

    const handleClickEditBtn = (clinic: Clinic) => {
        setClinic(clinic);
        setIsUpdate(true);
        setOpenModalInputClinic(true);
        setClinicId(clinic.id);
    };
    const handleClickDeleteBtn = (clinic: Clinic) => {
        setClinic(clinic);
        setOpenModalConfirmDelete(true);
        setClinicId(clinic.id);
    };

    const openMessage = (type: NoticeType, content: string) => {
        api.open({
            type: type,
            content: content,
        });
    };

    const handleChangeLocation = (value: string) => {
        let province: string = '';
        const cityStr = 'thành phố';
        const provinceStr = 'tỉnh';
        if (value.toLowerCase().includes('thành phố')) {
            province = value.slice(cityStr.length, value.length);
        }
        if (value.toLowerCase().includes('tỉnh')) {
            province = value.slice(provinceStr.length, value.length);
        }
        const newOptions = { ...options, location: province };
        setOptions(newOptions);
    };

    const handleCloseInputModal = () => {
        setOpenModalInputClinic(false);
        setClinic({} as Clinic);
        setIsUpdate(false);
        navigate(`/admin/clinic`);
        queryClient.removeQueries({
            queryKey: ['useFetchClinicById', JSON.stringify(clinicId)],
            exact: true,
        });
    };
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        const newOptions = { ...options, name: value };
        setOptions(newOptions);
    };

    useEffect(() => {
        getProvinces();
    }, []);
    const { data, isError, error, isFetching, isRefetching, refetch } =
        useFetchClinicForAdmin({ pageIndex, pageSize });

    const handleConfirmDelete = () => {
        deleteClinic(clinicId, {
            onSuccess() {
                openMessage('success', 'Xóa thành công!');
                refetch();
                handleCancelModalConfirm();
            },
        });
    };
    return (
        <div className="">
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
                <Flex className="justify-content-between ps-2 pe-2 mb-3 ">
                    <h5>Danh sách cơ sở y tế</h5>
                    <Button
                        className="border-0 text-white bg-primary"
                        onClick={() => setOpenModalInputClinic(true)}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                </Flex>
                <Flex gap={'middle'} className="mb-3 justify-content-between">
                    <Flex className="col-5" gap={'middle'}>
                        <div className="col-5">
                            <Select
                                className="d-block"
                                placeholder="Chọn tỉnh thành"
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                value={options.majorId}
                                onChange={handleChangeLocation}
                            >
                                {provinces.map((province: ProvinceType) => (
                                    <Option
                                        value={province.province_name}
                                        key={province.province_id}
                                    >
                                        {province.province_name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Flex>
                    <Flex className="col-5 justify-content-end position-relative">
                        <Search
                            onSearch={onSearch}
                            placeholder="Nhập thông tin tìm kiếm"
                            className=""
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>

                <Skeleton active loading={isFetching || isRefetching}>
                    {isError ? (
                        <p className="fw-bold text-center">
                            {error?.message.includes('404')
                                ? 'Không có cơ sở y tế nào !'
                                : 'Có lỗi khi lấy dữ liệu vui lòng thử lại sau'}
                        </p>
                    ) : (
                        <ClinicCards
                            clinics={data?.clinics}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            changePage={changePage}
                            pageCount={data?.pageCount}
                            handleClickEditBtn={handleClickEditBtn}
                            handleClickDeleteBtn={handleClickDeleteBtn}
                            openNotification={openMessage}
                        />
                    )}
                </Skeleton>
            </div>
            {openModalInputClinic && (
                <InputClinicModal
                    openModal={openModalInputClinic}
                    onCloseModal={handleCloseInputModal}
                    isUpdateClinic={isUpdate}
                    openMessage={openMessage}
                    refetch={refetch}
                />
            )}
            {openModalConfirmDelete && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa cơ sở y tế này?"
                    isOpenModal={openModalConfirmDelete}
                    onCloseModal={handleCancelModalConfirm}
                    handleOk={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default ClinicManagement;
