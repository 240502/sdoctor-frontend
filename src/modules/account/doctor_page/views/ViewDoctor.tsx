import { useState, useEffect, useRef, useMemo } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Select, Flex, Input, Skeleton } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { useRecoilState } from 'recoil';
import {
    doctorListState,
    doctorPagination,
    isPreventCallApi,
    doctorOptions,
} from '../../../../stores/doctorAtom';
import { Clinic } from '../../../../models/clinic';
import { DoctorCard } from '../components/DoctorCard';
import { useFetchDataWithPaginationProps } from '../../../../hooks';
import { Doctor } from '../../../../models/doctor';
import ShowMoreComp from '../../../../components/ShowMoreComp';
import {
    VIEW_CLINIC_ENDPOINT,
    VIEW_DOCTOR_ENDPOINT,
    VIEW_MAJOR_ENDPOINT,
} from '../../../../constants/endpoints';
import { Major } from '../../../../models/major';
import { useSearchParams } from 'react-router-dom';
import { allClinicsState } from '../../../../stores/clinicAtom';
import { allMajorsState } from '../../../../stores/majorAtom';
const { Option } = Select;
const { Search } = Input;

const ViewDoctor = () => {
    const [searchParams] = useSearchParams();
    const [doctorsState, setDoctorsState] = useRecoilState(doctorListState);
    const [majorsState, setMajorsState] = useRecoilState(allMajorsState);
    const [clinicsState, setClinicsState] = useRecoilState(allClinicsState);
    const [doctorPaginationState, setDoctorPaginationState] =
        useRecoilState(doctorPagination);
    const [isPreventCallApiGetDoctors, setIsPreventCallApiGetDoctors] =
        useRecoilState(isPreventCallApi);

    const [doctorOptionsState, setDoctorOptions] =
        useRecoilState(doctorOptions);
    const {
        data: doctors,
        loading: loadingDoctors,
        error: errorDoctors,
        pageCount,
        resetFirstFetch,
    } = useFetchDataWithPaginationProps<Doctor>(
        VIEW_DOCTOR_ENDPOINT,
        {
            filterOptions: doctorOptionsState as any,
            pageIndex: doctorPaginationState.pageIndex,
            pageSize: doctorPaginationState.pageSize,
        },
        isPreventCallApiGetDoctors
    );

    const { data: clinics } = useFetchDataWithPaginationProps<Clinic>(
        VIEW_CLINIC_ENDPOINT,
        undefined,
        clinicsState.length > 0
    );
    const { data: majors } = useFetchDataWithPaginationProps<Major>(
        VIEW_MAJOR_ENDPOINT,
        undefined,
        majorsState.length > 0
    );

    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const handleOnClickShowMoreButton = () => {
        if (doctorPaginationState.pageIndex < pageCount) {
            setDoctorPaginationState({
                ...doctorPaginationState,
                pageIndex: doctorPaginationState.pageIndex + 1,
            });
        }
    };

    useEffect(() => {
        setDoctorPaginationState({
            ...doctorPaginationState,
            pageCount: pageCount,
        });

        if (!doctors || doctors.length === 0) {
            return;
        }
        let timeOutId: any;
        if (doctorsState.length > 0) {
            const isSameData =
                doctorsState.length === doctors?.length &&
                doctorsState.every(
                    (doctor: Doctor, index: number) =>
                        doctor.doctor_id === doctors[index].doctor_id
                );
            if (isSameData) {
                return;
            }
            const existingKeys = new Set(
                doctorsState.map((doctor: Doctor) => doctor.doctor_id)
            );
            const newItems = doctors.filter(
                (doctor: Doctor) => !existingKeys.has(doctor.doctor_id)
            );
            const newDoctors = [...doctorsState, ...newItems];
            const isSameNewData =
                doctorsState?.length === newDoctors?.length &&
                doctorsState.every(
                    (doctor: Doctor, index: number) =>
                        doctor.doctor_id === newDoctors[index].doctor_id
                );
            if (isSameNewData) {
                return;
            }

            setDoctorsState(newDoctors);
        } else {
            setTimeout(() => {
                timeOutId = setDoctorsState(doctors);
            }, 1000);
        }
        return () => {
            clearTimeout(timeOutId);
        };
    }, [doctors]);

    useEffect(() => {
        if (majorsState.length === 0) {
            setMajorsState(majors);
        }
    }, [majors]);

    useEffect(() => {
        if (majorsState.length === 0) {
            setClinicsState(clinics);
        }
    }, [clinics]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (searchParams.get('majorId')) {
            setDoctorOptions({
                ...doctorOptionsState,
                majorId: Number(searchParams.get('majorId')),
            });
            resetFirstFetch('/doctor/view');
        }
        if (searchParams.get('name')) {
            setDoctorOptions({
                ...doctorOptionsState,
                name: searchParams.get('name') ?? '',
            });
            resetFirstFetch('/doctor/view');
        }
        if (doctorsState.length > 0) {
            setIsPreventCallApiGetDoctors(true);
        }

        return () => {};
    }, []);
    useEffect(() => {
        console.log('doctorOptionsState', doctorOptionsState);
    }, [doctorOptionsState]);

    return (
        <div className="container doctor-list mt-4 mb-4">
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
                {/* Group filter options */}
                <Flex
                    gap={'middle'}
                    className="justify-content-between shadow p-3 rounded mb-3"
                >
                    <Flex className="col-5" gap={'middle'}>
                        <div className="col">
                            <Select
                                className="d-block"
                                placeholder="Chọn cơ sở y tế"
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                value={
                                    doctorOptionsState.clinicId !== 0
                                        ? doctorOptionsState.clinicId
                                        : null
                                }
                                onChange={(value: any) => {
                                    setDoctorOptions({
                                        ...doctorOptionsState,
                                        clinicId: value ?? null,
                                    });
                                    resetFirstFetch('/doctor/view');
                                }}
                            >
                                {clinicsState.map((clinic: Clinic) => (
                                    <Option
                                        key={clinic.id}
                                        value={clinic.id}
                                        label={clinic.name}
                                    >
                                        {clinic.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col">
                            <Select
                                className="d-block"
                                placeholder="Chọn chuyên ngành"
                                optionFilterProp="children"
                                allowClear
                                showSearch
                                value={
                                    doctorOptionsState.majorId !== 0
                                        ? doctorOptionsState.majorId
                                        : searchParams.get('majorId')
                                        ? Number(searchParams.get('majorId'))
                                        : null
                                }
                                onChange={(value: any) => {
                                    setDoctorOptions({
                                        ...doctorOptionsState,
                                        majorId: value ?? null,
                                    });
                                    resetFirstFetch('/doctor/view');
                                }}
                            >
                                {majorsState?.map((major: Major) => (
                                    <Option
                                        key={major.id}
                                        value={major.id}
                                        label={major.name}
                                    >
                                        {major.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Flex>
                    <Flex className="col-5 justify-content-end position-relative">
                        <Search
                            className="search-input"
                            placeholder="Nhập tên bác sĩ"
                            value={doctorOptionsState.name}
                            onChange={(e) => {
                                setDoctorOptions({
                                    ...doctorOptionsState,
                                    name: e.target.value,
                                });
                            }}
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>
                <>
                    {errorDoctors ? (
                        <p className="fs-6 fw-bold text-center mt-4">
                            {' '}
                            {errorDoctors}
                        </p>
                    ) : (
                        <>
                            <Skeleton
                                loading={doctorsState?.length === 0}
                                active
                                className="mt-6"
                            >
                                <DoctorCard
                                    doctors={doctorsState}
                                    handleUpdateViewsDoctor={
                                        handleUpdateViewsDoctor
                                    }
                                />
                            </Skeleton>

                            {(doctorPaginationState?.pageIndex < pageCount ||
                                loadingDoctors) && (
                                <ShowMoreComp
                                    loading={loadingDoctors}
                                    onClick={handleOnClickShowMoreButton}
                                />
                            )}
                        </>
                    )}
                </>
            </div>
        </div>
    );
};
export default ViewDoctor;
