import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Select, Input, Skeleton, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DoctorCard } from '../../../../components';
import {
    useFetchDepartmentByClinicId,
    useFetchDoctorsWithPagination,
    useFetchSpecializationsWithPagination,
} from '../../../../hooks';
import { Department, Major } from '../../../../models';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
const DoctorsTab = ({ clinicId }: any) => {
    const observerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        console.log('clinicId', clinicId);
    }, []);
    const {
        data: specializationRes,
        isFetching: isFetchingSpecialization,
        error: specializationError,
    } = useFetchSpecializationsWithPagination({});
    const [doctorOptions, setDoctorFilterOptions] =
        useRecoilState(doctorFilterOptions);
    const {
        data: doctorRes,
        error,
        isFetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useFetchDoctorsWithPagination({
        ...doctorOptions,
        clinicId: clinicId,
    });
    const { data: departmentRes, isFetching: isFetchingDepartment } =
        useFetchDepartmentByClinicId(clinicId);
    const doctors = useMemo(() => {
        return doctorRes?.pages.flatMap((page) => page.data) ?? [];
    }, [doctorRes]);
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
    return (
        <Row
            gutter={24}
            className="group-filter-options justify-content-between rounded mb-3"
        >
            <Col span={6} className="p-3 shadow rounded">
                <div>
                    <h6>Chuyên ngành</h6>
                    <Select
                        className="w-100"
                        placeholder="Chọn chuyên ngành"
                        optionFilterProp="children"
                        showSearch
                        mode="multiple"
                        allowClear
                        onChange={(value: number[]) => {
                            setDoctorFilterOptions({
                                ...doctorOptions,
                                majorIds: value,
                            });
                        }}
                    >
                        {!isFetchingSpecialization &&
                            specializationRes?.majors.map((major: Major) => {
                                return (
                                    <Select.Option
                                        key={major.name}
                                        value={major.id}
                                    >
                                        {' '}
                                        {major.name}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </div>
                <Divider />

                <div>
                    <h6>Chuyên khoa</h6>
                    <Select
                        className="w-100"
                        placeholder="Chọn chuyên khoa"
                        optionFilterProp="children"
                        showSearch
                        allowClear
                        onChange={(value: number) => {
                            setDoctorFilterOptions({
                                ...doctorOptions,
                                departmentId: value,
                            });
                        }}
                    >
                        {!isFetchingDepartment &&
                            departmentRes?.map((department: Department) => {
                                return (
                                    <Select.Option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {' '}
                                        {department.name}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </div>
            </Col>
            {/* <Col span={4} className="position-relative group-search">
                    <Input
                        placeholder="Tìm kiếm"
                        // onChange={(e: any) => {
                        //     setSearchContent(e.target.value);
                        // }}
                    ></Input>
                    <SearchOutlined className="position-absolute search-icon"></SearchOutlined>
                </Col> */}
            <Col span={18}>
                <Skeleton active loading={isFetching || isFetchingNextPage}>
                    {error ? (
                        <p className="text-center fw-bold">
                            {error.message.includes('404')
                                ? 'Không có dữ liệu !'
                                : error.message}
                        </p>
                    ) : (
                        <DoctorCard doctors={doctors} />
                    )}
                </Skeleton>
                <div
                    ref={observerRef}
                    // style={{ height: 20, marginBottom: 20 }}
                />
            </Col>
        </Row>
    );
};

export default DoctorsTab;
