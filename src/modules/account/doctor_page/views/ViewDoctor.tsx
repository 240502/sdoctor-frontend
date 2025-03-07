import { useState, useEffect, useMemo } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Select, Flex, Input } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorState,
    searchDoctorOptionsGlobal,
} from '../../../../stores/doctorAtom';
import { MajorService } from '../../../../services/majorService';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { DoctorCard } from '../components/DoctorCard';
import { useFetchDataWithPaginationProps } from '../../../../hooks';
import { Doctor } from '../../../../models/doctor';
import { paginationState } from '../../../../stores/paginationAtom';
import LoadingLayout from '../../../../layouts/loading_layout/LoadingLayout';
import ShowMoreComp from '../../../../components/ShowMoreComp';
import {
    VIEW_CLINIC_ENDPOINT,
    VIEW_DOCTOR_ENDPOINT,
} from '../../../../constants/endpoints';
const { Option } = Select;
const { Search } = Input;

const ViewDoctor = () => {
    const [optionsGlobal, setOptionsGlobal] = useRecoilState(
        searchDoctorOptionsGlobal
    );

    const [options, setOptions] = useState<any>({
        majorId: null,
        clinicId: null,
        name: null,
        pageIndex: 1,
        pageSize: 8,
    });
    const [searchContent, setSearchContent] = useState<string>('');
    const [pagination, setPagination] = useRecoilState(paginationState);
    const {
        data: doctors,
        loading: loadingDoctors,
        error: errorDoctors,
        pageCount: doctorPageCount,
    } = useFetchDataWithPaginationProps<Doctor>(VIEW_DOCTOR_ENDPOINT, options);

    const {
        data: clinics,
        loading: loadingClinics,
        error: errorClinics,
        pageCount: clinicPageCount,
    } = useFetchDataWithPaginationProps<Clinic>(VIEW_CLINIC_ENDPOINT);
    useEffect(() => {
        console.log('clinics', clinics);
    }, [clinics]);
    const [doctorsState, setDoctorsState] = useRecoilState(doctorListState);
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const handleOnClickShowMoreButton = () => {
        if (options.pageIndex < doctorPageCount) {
            setOptions({ ...options, pageIndex: options.pageIndex + 1 });
        }
    };

    useEffect(() => {
        if (!doctors) {
            return;
        }
        if (doctorsState.length > 0) {
            if (JSON.stringify(doctorsState) === JSON.stringify(doctors)) {
                return;
            }
            const existingKeys = new Set(
                doctorsState.map((doctor: Doctor) => doctor.doctor_id)
            );
            const newItems = doctors.filter(
                (doctor: Doctor) => !existingKeys.has(doctor.doctor_id)
            );
            const newDoctors = [...doctorsState, ...newItems];
            if (JSON.stringify(doctorsState) === JSON.stringify(newDoctors)) {
                console.log('dữ liệu cũ giống với dữ liệu mới 2');
                return;
            }
            setDoctorsState(newDoctors);
        } else {
            if (JSON.stringify(doctorsState) !== JSON.stringify(doctors)) {
                setDoctorsState(doctors);
                console.log('set state lần 1:');
            }
        }
    }, [doctors]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (optionsGlobal.name || optionsGlobal.majorId) {
            setOptions({
                ...options,
                majorId: optionsGlobal.majorId,
                name: optionsGlobal.name,
            });
            setSearchContent(optionsGlobal.name);
        }

        return () => {
            setOptions({
                majorId: null,
                clinicId: null,
                pageIndex: 1,
                pageSize: 8,
            });
            setOptionsGlobal({
                majorId: null,
                name: null,
            });
        };
    }, []);

    return (
        <LoadingLayout loading={loadingDoctors}>
            {errorDoctors ? (
                <p className="fs-6 fw-bold text-center mt-4"> {errorDoctors}</p>
            ) : (
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
                    <div className="block__list__doctor mt-3">
                        <Flex
                            gap={'middle'}
                            className=" justify-content-between shadow p-3 rounded"
                        >
                            <Flex className="col-5" gap={'middle'}>
                                <div className="col">
                                    <Select
                                        className="d-block"
                                        placeholder="Chọn cơ sở y tế"
                                        optionFilterProp="children"
                                        allowClear
                                        showSearch
                                        value={options.clinicId}
                                        onChange={(value: any) => {
                                            setOptions({
                                                ...options,
                                                clinicId: value ?? null,
                                            });
                                            setPagination({
                                                ...pagination,
                                                pageIndex: 1,
                                            });
                                        }}
                                    >
                                        {/* {clinics.map((clinic: Clinic) => (
                                        <Option
                                            key={clinic.id}
                                            value={clinic.id}
                                            label={clinic.name}
                                        >
                                            {clinic.name}
                                        </Option>
                                    ))} */}
                                    </Select>
                                </div>
                                <div className="col">
                                    <Select
                                        className="d-block"
                                        placeholder="Chọn chuyên ngành"
                                        optionFilterProp="children"
                                        allowClear
                                        showSearch
                                        value={options.majorId}
                                        onChange={(value: any) => {
                                            setOptions({
                                                ...options,
                                                majorId: value ?? null,
                                            });
                                            setPagination({
                                                ...pagination,
                                                pageIndex: 1,
                                            });
                                        }}
                                    >
                                        {/* {majors?.map((major: Major) => (
                                            <Option
                                                key={major.id}
                                                value={major.id}
                                                label={major.name}
                                            >
                                                {major.name}
                                            </Option>
                                        ))} */}
                                    </Select>
                                </div>
                            </Flex>
                            <Flex className="col-5 justify-content-end position-relative">
                                <Search
                                    className="search-input"
                                    placeholder="Nhập tên bác sĩ"
                                    value={searchContent}
                                    onSearch={() => {
                                        setOptions({
                                            ...options,
                                            name: searchContent,
                                        });
                                    }}
                                    onChange={(e) => {
                                        setSearchContent(e.target.value);
                                    }}
                                    style={{ width: '48%' }}
                                />
                            </Flex>
                        </Flex>
                        <>
                            <DoctorCard
                                doctors={doctorsState}
                                handleUpdateViewsDoctor={
                                    handleUpdateViewsDoctor
                                }
                            />
                            {options?.pageIndex < doctorPageCount && (
                                <ShowMoreComp
                                    loading={loadingDoctors}
                                    onClick={handleOnClickShowMoreButton}
                                />
                            )}
                        </>
                    </div>
                </div>
            )}
        </LoadingLayout>
    );
};
export default ViewDoctor;
