import { HomeOutlined } from '@ant-design/icons';
import '@/assets/scss/clinic.scss';
import { Breadcrumb, Col, Divider, Row, Skeleton } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { ClinicCard } from '../components/ClinicCard';
import { useFetchClinicsWithPagination } from '../../../../hooks';
import ProvinceOptions from '../components/ProvinceOptions';
import DepartmentOptions from '../components/DepartmentOptions';
import { useRecoilValue } from 'recoil';
import { clinicFilterOptionsValue } from '../../../../stores/clinicAtom';
const ViewClinic = () => {
    const clinicOptions = useRecoilValue(clinicFilterOptionsValue);
    const {
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchClinicsWithPagination(clinicOptions);

    const clinics = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasNextPage, isFetchingNextPage]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container view-clinic-container mt-5 mb-5">
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Danh sách cơ sở y tế`,
                    },
                ]}
            />
            <div className="mt-3">
                <Row gutter={[24, 24]}>
                    <Col span={6} className="shadow rounded p-3">
                        <ProvinceOptions />
                        <Divider />
                        <DepartmentOptions />
                    </Col>
                    <Col span={18}>
                        <Skeleton active loading={isFetching}>
                            {error ? (
                                <p className="fs-6 fw-bold text-center mt-4">
                                    {error?.message.includes('404')
                                        ? 'Không có dữ liệu !'
                                        : 'Có lỗi khi lấy dữ liệu !'}
                                </p>
                            ) : (
                                <>
                                    {!error && <ClinicCard clinics={clinics} />}
                                </>
                            )}
                        </Skeleton>
                        <div
                            ref={observerRef}
                            // style={{ height: 20, marginBottom: 20 }}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default ViewClinic;
