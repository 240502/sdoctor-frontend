import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import '@/assets/scss/clinic.scss';

import { Breadcrumb, Button, Divider, Image, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { ClinicService } from '../../../../services/clinicService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    clinicListState,
    clinicListValue,
} from '../../../../stores/clinicAtom';
import { useEffect, useRef, useState } from 'react';
import { SearchProps } from 'antd/es/input';
import { Clinic } from '../../../../models/clinic';
import { baseURL } from '../../../../constants/api';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { addWatchedClinic } from '../../../../utils/clinic';
const { Search } = Input;
const ViewClinic = () => {
    const [optionsFilter, setOptionsFilter] = useState<any>({
        location: null,
        name: null,
    });
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [provinces, setProvinces] = useState([
        { province_id: 0, province_name: '' },
    ]);

    const [pageCount, setPageCount] = useState<number>(0);
    const setClinics = useSetRecoilState(clinicListState);
    const clinics = useRecoilValue(clinicListValue);
    const sectionTopRef = useRef<HTMLDivElement>(null);
    const scrollToSection = (sectionRef: any) => {
        sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const viewClinic = async (data: any) => {
        try {
            const res = await ClinicService.viewClinic(data);
            console.log(res);
            setClinics(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            setClinics([]);
            console.log(err.message);
        }
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        const newOptions = { ...optionsFilter, name: value };
        setOptionsFilter(newOptions);
    };
    const handleChangeLocation = (value: string) => {
        let province: string = '';
        const cityStr = 'thành phố';
        const provinceStr = 'tỉnh';
        if (value.toLowerCase().includes('thành phố')) {
            province = value.slice(cityStr.length, value.length);
        }
        if (value.toLowerCase().includes('tỉnh')) {
            province = value.slice(provinceStr.length, value.length);
        }
        console.log(`selected ${province}`);
        const newOptions = { ...optionsFilter, location: province };
        setOptionsFilter(newOptions);
    };
    const changePageSize = (value: any) => {
        setPageIndex(1);

        setPageSize(Number(value));
    };
    const handleUpdateViewsClinic = async (id: number) => {
        try {
            const res = await ClinicService.updateViewsClinic(id);
            console.log(res);
        } catch (err: any) {}
    };
    const handlePageClick = (event: any) => {
        console.log(event.selected);
        setPageIndex(event.selected + 1);
    };
    useEffect(() => {
        const getProvinces = async () => {
            try {
                const res = await axios.get(
                    'https://vapi.vnappmob.com/api/province'
                );
                setProvinces(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        getProvinces();
        const data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            ...optionsFilter,
        };
        console.log(data);
        viewClinic(data);
        scrollToSection(sectionTopRef);
    }, [pageIndex, pageSize, optionsFilter]);
    return (
        <div className="container mt-5 mb-5" ref={sectionTopRef}>
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
            <div className="mt-3 d-flex">
                <h3 className="fs-4 fw-bold col-6">Cơ sở y tế</h3>
                <div className="group__search col-6 d-flex justify-content-between align-items-center">
                    <Select
                        className=""
                        style={{ width: '48%' }}
                        onChange={handleChangeLocation}
                        // onSearch={onSearchMajor}
                        showSearch
                        placeholder="Chọn tỉnh"
                        optionFilterProp="children"
                        defaultValue={'0'}
                    >
                        <Select.Option value={'0'}>
                            Chọn tỉnh thành
                        </Select.Option>
                        {provinces?.map((province: any) => {
                            return (
                                <Select.Option
                                    key={Number(province.province_id)}
                                    value={province.province_name}
                                >
                                    {province.province_name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                    <Search
                        onSearch={onSearch}
                        placeholder="Nhập thông tin tìm kiếm"
                        className=""
                        style={{ width: '48%' }}
                    />
                </div>
            </div>
            <Divider />

            {clinics ? (
                <>
                    <div className="bloc__clinics">
                        <div className="clinic_list row">
                            {clinics?.map((clinic: Clinic) => {
                                return (
                                    <div className="col-3 clinic ps-3 pe-3 mt-3 mb-3 text-center">
                                        <Link
                                            to={'/clinic/detail/' + clinic.id}
                                            className="d-inline-block"
                                            onClick={() => {
                                                handleUpdateViewsClinic(
                                                    Number(clinic.id)
                                                );
                                                addWatchedClinic(clinic);
                                            }}
                                            style={{ width: '100%' }}
                                        >
                                            <Image
                                                preview={false}
                                                style={{
                                                    width: '265px',
                                                    height: '147px',
                                                    objectFit: 'contain',
                                                }}
                                                className="border rounded ps-2 pt-4 pb-4 pe-2"
                                                src={baseURL + clinic.avatar}
                                            ></Image>
                                        </Link>
                                        <Link
                                            onClick={() => {
                                                handleUpdateViewsClinic(
                                                    Number(clinic.id)
                                                );
                                                addWatchedClinic(clinic);
                                            }}
                                            to={'/clinic/detail/' + clinic.id}
                                            className="text-decoration-none text-reset"
                                        >
                                            <h6 className="mt-3 fs-5">
                                                {clinic.name}
                                            </h6>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <section className="page d-flex justify-content-center align-items-center">
                        {pageCount > 1 ? (
                            <div className="col-2 list-page">
                                <ReactPaginate
                                    containerClassName={'pagination'}
                                    className="d-flex m-0 "
                                    breakLabel="..."
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={pageCount}
                                    previousLabel={
                                        <Button className="rounded">
                                            <DoubleLeftOutlined />
                                        </Button>
                                    }
                                    nextLabel={
                                        <Button className="rounded">
                                            <DoubleRightOutlined />
                                        </Button>
                                    }
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="col-2 ms-5">
                            <Select
                                defaultValue="10"
                                style={{ width: 120 }}
                                onChange={changePageSize}
                                options={[
                                    { value: '5', label: '5' },
                                    { value: '10', label: '10' },
                                    { value: '15', label: '15' },
                                ]}
                            />
                        </div>
                    </section>
                </>
            ) : (
                <p className="text-center fs-6 fw-bold">
                    Không tồn tại cơ sở y tế nào
                </p>
            )}
        </div>
    );
};
export default ViewClinic;
