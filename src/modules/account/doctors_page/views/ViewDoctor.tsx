import { useEffect, useMemo, useRef } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Skeleton, Col, Row, Divider } from 'antd';
import { useRecoilState } from 'recoil';
import BlockClinicOptions from '../components/BlockClinicOptions';
import BlockGenderOptions from '../components/BlockGenderOptions';
import { DoctorCard } from '../../../../components';
import {
    BlockSpecializationOptions,
    PriceOptionsComp,
    TitleOptions,
} from '../components';
import { useFetchDoctorsWithPagination } from '../../../../hooks';
import { doctorFilterOptions } from '../../../../stores';
import { useSearchParams } from 'react-router-dom';
const ViewDoctor = () => {
    const [searchParams] = useSearchParams();
    const [doctorOptions, setDoctocOptions] =
        useRecoilState(doctorFilterOptions);
    const {
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchDoctorsWithPagination(doctorOptions);

    const doctors = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);
    // ======= Infinite Scroll Logic =======
    const observerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        window.scrollTo(0, 0);
        const majorId = searchParams.get('majorId');
        if (majorId) {
            if (doctorOptions.majorIds.length === 0) {
                setDoctocOptions({
                    ...doctorOptions,
                    majorIds: [Number(majorId)],
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

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
    return (
        <div className="doctor-list mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Danh sách bác sĩ`,
                    },
                ]}
            />
            <div className="mt-3">
                <Row gutter={[24, 24]}>
                    <Col span={6} className="shadow rounded p-3">
                        <BlockClinicOptions />
                        <Divider />
                        <BlockSpecializationOptions />
                        <Divider />
                        <PriceOptionsComp />
                        <Divider />
                        <TitleOptions />
                        <Divider />
                        <BlockGenderOptions />
                        <Divider />
                    </Col>
                    <Col span={18}>
                        <>
                            {error ? (
                                <p className="fs-6 fw-bold text-center mt-4">
                                    {'Không có dữ liệu !'}
                                </p>
                            ) : (
                                <>
                                    <Skeleton
                                        loading={
                                            isFetching || isFetchingNextPage
                                        }
                                        active
                                        className="mt-6"
                                    >
                                        {doctors && (
                                            <DoctorCard doctors={doctors} />
                                        )}
                                    </Skeleton>
                                    <div
                                        ref={observerRef}
                                        // style={{ height: 20, marginBottom: 20 }}
                                    />
                                </>
                            )}
                        </>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default ViewDoctor;
