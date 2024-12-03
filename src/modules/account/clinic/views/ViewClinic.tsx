import { HomeOutlined } from '@ant-design/icons';
import '@/assets/scss/clinic.scss';

import {
    Breadcrumb,
    Divider,
    Flex,
    Image,
    Input,
    Pagination,
    Select,
} from 'antd';
import { Link } from 'react-router-dom';
import { ClinicService } from '../../../../services/clinicService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    clinicListState,
    clinicListValue,
} from '../../../../stores/clinicAtom';
import { useEffect, useState } from 'react';
import { SearchProps } from 'antd/es/input';
import { Clinic } from '../../../../models/clinic';
import { baseURL } from '../../../../constants/api';
import axios from 'axios';
import { addWatchedClinic } from '../../../../utils/clinic';
const { Search } = Input;
const ViewClinic = () => {
    const [optionsFilter, setOptionsFilter] = useState<any>({
        location: null,
        name: null,
    });
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [provinces, setProvinces] = useState([
        { province_id: 0, province_name: '' },
    ]);

    const [pageCount, setPageCount] = useState<number>(0);
    const setClinics = useSetRecoilState(clinicListState);
    const clinics = useRecoilValue(clinicListValue);

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
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    const handleUpdateViewsClinic = async (id: number) => {
        try {
            const res = await ClinicService.updateViewsClinic(id);
            console.log(res);
        } catch (err: any) {}
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
        window.scrollTo(0, 0);
    }, [pageIndex, pageSize, optionsFilter]);
    return (
        <div className="container mt-5 mb-5">
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
            </div>
            <Divider />
            <Flex className="group__search  d-flex justify-content-between align-items-center">
                <div className="col-5">
                    <Select
                        className=""
                        style={{ width: '48%' }}
                        onChange={handleChangeLocation}
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
                </div>
                <Flex className="col-5 justify-content-end">
                    <Search
                        onSearch={onSearch}
                        placeholder="Nhập tên cơ sở y tế"
                        className=""
                        style={{ width: '48%' }}
                    />
                </Flex>
            </Flex>
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
                                                src={
                                                    clinic.avatar.includes(
                                                        'cloudinary'
                                                    )
                                                        ? clinic.avatar
                                                        : baseURL +
                                                          clinic.avatar
                                                }
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
                            <Pagination
                                showSizeChanger
                                defaultCurrent={1}
                                align="center"
                                current={pageIndex}
                                pageSize={pageSize}
                                total={pageCount * pageSize}
                                pageSizeOptions={['5', '10', '20', '30']}
                                onChange={(current: number, size: number) => {
                                    changePage(current, size);
                                }}
                            />
                        ) : (
                            <></>
                        )}
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
