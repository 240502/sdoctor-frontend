import {
    Breadcrumb,
    notification,
    Divider,
    Flex,
    Row,
    Col,
    Button,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { ServiceService } from '../../../../services/serviceService';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { configValue } from '../../../../stores/userAtom';
import { Service } from '../../../../models/service';
import { InputServiceModal } from '../components/InputServiceModal';
import { ClinicService } from '../../../../services/clinicService';
import { Clinic } from '../../../../models/clinic';
import { ServiceCategory } from '../../../../models/category_services';
import { ServiceCategoryService } from '../../../../services/serviceCategoryService';
import { serviceListState } from '../../../../stores/servicesAtom';
type NotificationType = 'success' | 'error';

const ServiceManagement = () => {
    const config = useRecoilValue(configValue);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(8);
    const [pageCount, setPageCount] = useState<number>(0);
    const [filterOptions, setFilterOptions] = useState<any>({
        clinicId: null,
        categoryId: null,
    });
    const [api, contextHolder] = notification.useNotification();
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [service, setService] = useState<Service>({} as Service);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [services, setServices] = useRecoilState(serviceListState);
    const getServices = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                clinicId: filterOptions.clinicId,
                categoryId: filterOptions.categoryId,
            };
            const res = await ServiceService.viewService(data);
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
    const onClickEditButton = (service: Service) => {
        setOpenInputModal(true);
        setService(service);
    };
    const cancelModal = () => {
        setService({} as Service);
        setOpenInputModal(false);
    };
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            console.log('clinic', res);
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
            setClinics([]);
        }
    };
    const getAllServiceCategory = async () => {
        try {
            const res = await ServiceCategoryService.getAll();
            console.log('categories', res);
            setCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setCategories([]);
        }
    };
    useEffect(() => {
        getAllClinic();
        getAllServiceCategory();
        getServices();
    }, [pageIndex, pageSize, filterOptions]);
    useEffect(() => {
        console.log('services', services);
    }, [services]);
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
        </>
    );
};

export default ServiceManagement;
