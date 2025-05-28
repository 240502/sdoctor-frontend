import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { medicalPackageOptionsValue } from '../../../../stores/medical_packageAtom';
import { Row, Col, Breadcrumb, Divider, Skeleton } from 'antd';
import '@/assets/scss/service.scss';
import { HomeOutlined } from '@ant-design/icons';
import { MedicalPackageCard } from '../../../../components';
import { useFetchMedicalPackageWithPaginationAndOptions } from '../../../../hooks';
import BlockClinicOptions from '../components/BlockClinicOptions';
import CategoryOptionsComp from '../components/CategoryOptionsComp';
import { PriceOptionsComp } from '../components';
import CityOptionsComp from '../components/CityOptionsComp';

const ViewService = () => {
    const medicalPackageOptions = useRecoilValue(medicalPackageOptionsValue);
    const { data, error, isFetching } =
        useFetchMedicalPackageWithPaginationAndOptions(medicalPackageOptions);

    const medicalPackages = useMemo(() => {
        return data?.pages.flatMap((page) => page.medicalPackages) ?? [];
    }, [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        console.log('medicalPackageOptions', medicalPackageOptions);
    }, [medicalPackageOptions]);
    return (
        <div className="container view-service-container  mt-4 mb-4">
            <Breadcrumb
                items={[
                    { href: '/', title: <HomeOutlined /> },
                    { title: 'Dịch vụ' },
                ]}
            />

            <div className="service-list mt-4">
                <Row gutter={[24, 24]}>
                    <Col span={6} className="shadow rounded p-3">
                        <BlockClinicOptions />
                        <Divider />
                        <CategoryOptionsComp />
                        <Divider />
                        <CityOptionsComp />
                        <Divider />
                        <PriceOptionsComp />
                    </Col>
                    <Col span={18}>
                        <Skeleton active loading={isFetching}>
                            {error ? (
                                <p className=" fw-bold mt-4 text-center">
                                    {error.message.includes('404')
                                        ? 'Không có dữ liệu !'
                                        : error.message}
                                </p>
                            ) : (
                                medicalPackages && (
                                    <MedicalPackageCard
                                        medicalPackages={medicalPackages}
                                    />
                                )
                            )}
                        </Skeleton>
                        <Skeleton active loading={isFetching}></Skeleton>
                        <Skeleton active loading={isFetching}></Skeleton>
                        <Skeleton active loading={isFetching}></Skeleton>

                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default ViewService;
