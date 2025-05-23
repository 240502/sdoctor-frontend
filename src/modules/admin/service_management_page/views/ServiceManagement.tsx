import {
    Breadcrumb,
    notification,
    Divider,
    Row,
    Col,
    Button,
    Pagination,
    Skeleton,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
    medicalPackageService,
    clinicService,
    serviceCategoryService,
} from '../../../../services';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { MedicalPackage, MedicalPackageOptions } from '../../../../models/medical_package';
import { InputServiceModal } from '../components/InputServiceModal';
import { Clinic } from '../../../../models/clinic';
import { ServiceCategory } from '../../../../models/category_services';
// import { s } from '../../../../services/service_category.service';
import { serviceListState } from '../../../../stores/medical_packageAtom';
import ServiceCard from '../components/ServiceCard';
import { ConfirmModal } from '../../../../components';
import { openNotification } from '../../../../utils/notification';
import { useFetchMedicalPackageForAdmin } from '../../../../hooks';

const ServiceManagement = () => {
    const config = useRecoilValue(configValue);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [pageCount, setPageCount] = useState<number>(0);
    const [filterOptions, setFilterOptions] = useState<any>({
        clinicId: null,
        categoryId: null,
    });
    const [api, contextHolder] = notification.useNotification();
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [service, setService] = useState<MedicalPackage>(
        {} as MedicalPackage
    );
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [services, setServices] = useRecoilState(serviceListState);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const getServices = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                clinicId: filterOptions.clinicId,
                categoryId: filterOptions.categoryId,
            };
            const res = await medicalPackageService.viewService(data);
            console.log('services', res);
            console.log('call api');
            setPageCount(res.pageCount);
            setServices(res.data);
        } catch (err: any) {
            console.log(err);
            setPageCount(0);
            setServices([]);
        }
    };
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageSize(size);
            setPageIndex(1);
        } else {
            setPageIndex(current);
        }
    };
    const onClickEditButton = (service: MedicalPackage) => {
        setOpenInputModal(true);
        setService(service);
        setIsUpdate(true);
    };
    const onClickDeleteButton = (service: MedicalPackage) => {
        setOpenConfirmModal(true);
        setService(service);
    };
    const cancelModal = () => {
        setService({} as MedicalPackage);
        setOpenInputModal(false);
        setIsUpdate(true);
    };
    const cancelConfirmModal = () => {
        setService({} as MedicalPackage);
        setOpenConfirmModal(false);
    };
    const getAllClinic = async () => {
        try {
            const res = await clinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
            setClinics([]);
        }
    };
    const getAllServiceCategory = async () => {
        try {
            const res = await serviceCategoryService.getAll();
            setCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setCategories([]);
        }
    };
    const DeleteService = async () => {
        try {
            openNotification(api, 'success', 'Thông báo', 'Xóa thành công!');
            const res = await medicalPackageService.deleteService(
                service?.id,
                config
            );
            cancelConfirmModal();
            setServices((prvServices: MedicalPackage[]) =>
                prvServices.filter(
                    (prvService: MedicalPackage) => service.id !== prvService.id
                )
            );
        } catch (err: any) {
            openNotification(
                api,
                'error',
                'Thông báo',
                'Xóa không thành công!'
            );

            console.log(err.message);
        }
    };

    const [options, setOptions] = useState<MedicalPackageOptions>({
        pageIndex: 1,
        pageSize: 8,
        clinicId:null,
        categoryIds:null,
        startPrice:null,
        endPrice:null,
        location:null,
        
    })
    const { data, isError, isFetching, refetch, isRefetching } = useFetchMedicalPackageForAdmin(options);
    
    useEffect(() => {
        getAllClinic();
        getAllServiceCategory();
    }, []);
  
    return (
        <>
            {contextHolder}
            <Row gutter={24} className="justify-content-between">
                <Col span={10}>
                    <Breadcrumb
                        items={[
                            { title: <HomeOutlined></HomeOutlined> },
                            { title: 'Gói khám' },
                        ]}
                    ></Breadcrumb>
                </Col>
                <Col span={10} className="text-end">
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenInputModal(true);
                        }}
                    >
                        Thêm mới <PlusOutlined />
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Skeleton active loading={isFetching || isRefetching}>
                    <div className=' block-services'>
                {!isError ? (
                    <>
                        <ServiceCard
                            services={data?.medicalPackages}
                            onClickEditButton={onClickEditButton}
                            onClickDeleteButton={onClickDeleteButton}
                        />
                        {data?.pageCount && options?.pageSize && (
                            <Pagination
                                className='mt-3'
                                align='center'
                                current={options.pageIndex}
                                pageSize={options.pageSize}
                                total={data?.pageCount * options?.pageSize}
                                onChange={changePage}
                                showSizeChanger
                                pageSizeOptions={['4', '8', '12', '16', '20']}
                            />
                        )}
                    </>
                ) : (
                    <p>Không có gói khám nào!</p>
                )}</div>  
            </Skeleton>
            {openInputModal && (
                <InputServiceModal
                    openInputModal={openInputModal}
                    cancelModal={cancelModal}
                    service={service}
                    setService={setService}
                    isUpdate={isUpdate}
                    clinics={clinics}
                    categories={categories}
                    config={config}
                    notificationApi={api}
                    setServices={setServices}
                />
            )}
            {openConfirmModal && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa gói khám này"
                    openModal={openConfirmModal}
                    handleCancelModal={cancelConfirmModal}
                    handleOk={DeleteService}
                />
            )}
        </>
    );
};

export default ServiceManagement;
