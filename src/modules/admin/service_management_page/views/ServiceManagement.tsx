import {
    Breadcrumb,
    Divider,
    Row,
    Col,
    Button,
    Pagination,
    Skeleton,
    message,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { clinicService, serviceCategoryService } from '../../../../services';
import { useState, useEffect } from 'react';
import {
    MedicalPackage,
    MedicalPackageOptions,
} from '../../../../models/medical_package';
import { InputMedicalPackageModal } from '../components/InputMedicalPackageModal';
import { Clinic } from '../../../../models/clinic';
import { ServiceCategory } from '../../../../models/category_services';
import ServiceCard from '../components/ServiceCard';
import { useFetchMedicalPackageForAdmin } from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

const ServiceManagement = () => {
    const [searchParams] = useSearchParams();
    const [api, contextHolder] = message.useMessage();
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [options, setOptions] = useState<MedicalPackageOptions>({
        pageIndex: 1,
        pageSize: 8,
        clinicId: null,
        categoryIds: null,
        startPrice: null,
        endPrice: null,
        location: null,
    });
    const changePage = (current: number, size: number) => {
        if (size !== options.pageSize) {
            setOptions({ ...options, pageSize: size, pageIndex: 1 });
        } else {
            setOptions({ ...options, pageIndex: current });
        }
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

    const { data, isError, isFetching, refetch, isRefetching } =
        useFetchMedicalPackageForAdmin(options);
    const onClickEditButton = (medicalPackage: MedicalPackage) => {
        setIsUpdate(true);
        setOpenInputModal(true);
    };
    const cancelModal = () => {
        setOpenInputModal(false);
        setIsUpdate(false);
        queryClient.removeQueries({
            queryKey: [
                'useFetchMedicalPackageById',
                JSON.stringify(Number(searchParams.get('package'))),
            ],
        });
    };
    useEffect(() => {
        getAllClinic();
        getAllServiceCategory();
    }, []);
    const openMessage = (type: NoticeType, content: string): void => {
        api.open({ type, content });
    };

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
                <div className=" block-services">
                    {!isError ? (
                        <>
                            <ServiceCard
                                medicalPackages={data?.medicalPackages}
                                onClickEditButton={onClickEditButton}
                                openMessage={openMessage}
                                refetch={refetch}
                            />
                            {data?.pageCount && options?.pageSize && (
                                <Pagination
                                    className="mt-3"
                                    align="center"
                                    current={options.pageIndex}
                                    pageSize={options.pageSize}
                                    total={data?.pageCount * options?.pageSize}
                                    onChange={changePage}
                                    showSizeChanger
                                    pageSizeOptions={[
                                        '4',
                                        '8',
                                        '12',
                                        '16',
                                        '20',
                                    ]}
                                />
                            )}
                        </>
                    ) : (
                        <p>Không có gói khám nào!</p>
                    )}
                </div>
            </Skeleton>
            {openInputModal && (
                <InputMedicalPackageModal
                    openInputModal={openInputModal}
                    cancelModal={cancelModal}
                    isUpdate={isUpdate}
                    clinics={clinics}
                    categories={categories}
                    openMessage={openMessage}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default ServiceManagement;
