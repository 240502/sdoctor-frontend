import { useEffect, useMemo } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Flex, Input, Skeleton, Col, Row, Divider } from 'antd';
import { doctorService } from '../../../../services/doctor.service';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { DoctorCard } from '../components/DoctorCard';
import { useFetchDoctorsWithPagination } from '../../../../hooks';
import ShowMoreComp from '../../../../components/ShowMoreComp';
import { useSearchParams } from 'react-router-dom';
import BlockClinicOptions from '../components/BlockClinicOptions';
import BlockGenderOptions from '../components/BlockGenderOptions';
import { BlockSpecializationOptions, PriceOptionsComp } from '../components';
const { Search } = Input;

const ViewDoctor = () => {
    const [searchParams] = useSearchParams();
    const [doctocOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    const {
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchDoctorsWithPagination(doctocOptions);

    const doctors = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);

    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (searchParams.get('majorId')) {
            setDoctorOptions({
                ...doctocOptions,
                majorId: Number(searchParams.get('majorId')),
            });
        }
        return () => {};
    }, []);
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
                <Flex
                    gap={'middle'}
                    className="justify-content-between shadow p-3 rounded mb-3"
                >
                    <Flex className="col-5 justify-content-end position-relative">
                        <Search
                            className="search-input"
                            placeholder="Nhập tên bác sĩ"
                            // value={doctocOptions.name}
                            onChange={(e) => {
                                // setDoctorOptions({
                                //     ...doctocOptions,
                                //     name: e.target.value,
                                // });
                            }}
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>
                <Row gutter={[24, 24]}>
                    <Col span={5} className="shadow rounded p-3">
                        <BlockClinicOptions />
                        <Divider />
                        <BlockSpecializationOptions />
                        <Divider />
                        <PriceOptionsComp />
                        <Divider />
                        <BlockGenderOptions />
                        <Divider />
                    </Col>
                    <Col span={19}>
                        <>
                            {error ? (
                                <p className="fs-6 fw-bold text-center mt-4">
                                    {' '}
                                    {error.message}
                                </p>
                            ) : (
                                <>
                                    <Skeleton
                                        loading={isFetching}
                                        active
                                        className="mt-6"
                                    >
                                        {doctors && (
                                            <DoctorCard
                                                doctors={doctors}
                                                handleUpdateViewsDoctor={
                                                    handleUpdateViewsDoctor
                                                }
                                            />
                                        )}
                                    </Skeleton>
                                </>
                            )}
                        </>
                    </Col>
                    {hasNextPage && (
                        <ShowMoreComp
                            loading={isFetchingNextPage}
                            onClick={fetchNextPage}
                        />
                    )}
                </Row>
            </div>
        </div>
    );
};
export default ViewDoctor;
