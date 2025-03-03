import { useState, useEffect, useRef } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Pagination, Select, Flex, Input } from 'antd';
import type { InputRef } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorListValue,
    searchDoctorOptionsGlobal,
} from '../../../../stores/doctorAtom';
import { MajorService } from '../../../../services/majorService';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { ClinicService } from '../../../../services/clinicService';
import { DoctorCard } from '../components/DoctorCard';
import { useFetchDataWithPaginationProps } from '../../../../hooks';
import { Doctor } from '../../../../models/doctor';
import { paginationState } from '../../../../stores/paginationAtom';
const { Option } = Select;
const { Search } = Input;
const ViewDoctor = () => {
    const [optionsGlobal, setOptionsGlobal] = useRecoilState(
        searchDoctorOptionsGlobal
    );
    const apiViewDoctorEndpoint = '/doctor/view-for-client';

    const doctors = useRecoilValue(doctorListValue);
    const [majors, setMajors] = useState<Major[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [options, setOptions] = useState<any>({
        majorId: null,
        clinicId: null,
        name: null,
    });
    const [searchContent, setSearchContent] = useState<string>('');
    const [pagination, setPagination] = useRecoilState(paginationState);
    const { data, loading, error, changePage } =
        useFetchDataWithPaginationProps<Doctor>(apiViewDoctorEndpoint, options);
    useEffect(() => {
        setDoctors(data);
    }, [data]);

    const setDoctors = useSetRecoilState(doctorListState);
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllMajor = async () => {
        try {
            const majorList = await MajorService.getAllMajor();
            setMajors(majorList);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getAllMajor();
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (optionsGlobal.name || optionsGlobal.majorId) {
            setOptions({
                ...options,
                majorId: optionsGlobal.majorId,
                name: optionsGlobal.name,
            });
            setSearchContent(optionsGlobal.name);
        }

        getAllClinic();
        return () => {
            setOptions({
                majorId: null,
                clinicId: null,
            });
            setOptionsGlobal({
                majorId: null,
                name: null,
            });
        };
    }, []);
    useEffect(() => {
        setDoctors(data);
    }, [data]);
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
                                {clinics.map((clinic: Clinic) => (
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
                                {majors?.map((major: Major) => (
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
                            value={searchContent}
                            onSearch={() => {
                                setOptions({ ...options, name: searchContent });
                            }}
                            onChange={(e) => {
                                setSearchContent(e.target.value);
                            }}
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>
                {loading ? (
                    <p className="fs-6 fw-bold text-center mt-4">
                        Đang tải dữ liệu...
                    </p>
                ) : error ? (
                    <p className="fs-6 fw-bold text-center mt-4"> {error}</p>
                ) : doctors.length > 0 ? (
                    <>
                        <DoctorCard
                            doctors={doctors}
                            handleUpdateViewsDoctor={handleUpdateViewsDoctor}
                        />
                        <Pagination
                            className="mt-3"
                            align="center"
                            current={pagination.pageIndex}
                            pageSize={pagination.pageSize}
                            showSizeChanger
                            pageSizeOptions={['4', '8', '12', '16', '20']}
                            onChange={changePage}
                            total={pagination.pageCount * pagination.pageSize}
                        />
                    </>
                ) : (
                    <p className="fs-6 fw-bold text-center mt-4">
                        Không có dữ liệu bác sĩ !
                    </p>
                )}
            </div>
        </div>
    );
};
export default ViewDoctor;
