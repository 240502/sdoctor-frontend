import { useState, useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Pagination, Select, Flex, Input } from 'antd';
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
import { SearchProps } from 'antd/es/input';
import { DoctorCard } from '../components/DoctorCard';
const { Option } = Select;
const { Search } = Input;
const ViewDoctor = () => {
    const [optionsGlobal, setOptionsGlobal] = useRecoilState(
        searchDoctorOptionsGlobal
    );
    const doctors = useRecoilValue(doctorListValue);
    const [majors, setMajors] = useState<Major[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [pageCount, setPageCount] = useState<number>(0);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [options, setOptions] = useState<any>({
        majorId: null,
        clinicId: null,
        name: null,
    });
    const setDoctors = useSetRecoilState(doctorListState);
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const loadData = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                ...options,
                name: options.name === null ? optionsGlobal.name : options.name,
            };
            const res = await doctorService.viewDoctor(data);
            setDoctors(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setDoctors([]);
        }
    };
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
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

    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        loadData();
    };
    useEffect(() => {
        loadData();
        getAllMajor();
        window.scrollTo(0, 0);
    }, [options.clinicId, options.majorId, pageIndex, pageSize]);
    useEffect(() => {
        setOptions({
            ...options,
            name: optionsGlobal.name,
            majorId: optionsGlobal.majorId,
        });
        getAllClinic();
        console.log(optionsGlobal);
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
                            onSearch={onSearch}
                            onChange={(e) => {
                                setOptions({
                                    ...options,
                                    name: e.target.value,
                                });
                            }}
                            placeholder="Nhập tên bác sĩ"
                            value={options.name}
                            style={{ width: '48%' }}
                        />
                    </Flex>
                </Flex>
                {doctors?.length ? (
                    <>
                        <DoctorCard
                            doctors={doctors}
                            handleUpdateViewsDoctor={handleUpdateViewsDoctor}
                        />
                        {pageCount > 1 && (
                            <Pagination
                                className="mt-3"
                                align="center"
                                current={pageIndex}
                                pageSize={pageSize}
                                showSizeChanger
                                pageSizeOptions={['4', '8', '12', '16', '20']}
                                onChange={changePage}
                                total={pageCount * pageSize}
                            />
                        )}
                    </>
                ) : (
                    <p className="fs-5 fw-bold text-center">
                        Không có bác sĩ nào
                    </p>
                )}
            </div>
        </div>
    );
};
export default ViewDoctor;
