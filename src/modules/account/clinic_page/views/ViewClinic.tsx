import { HomeOutlined } from '@ant-design/icons';
import '@/assets/scss/clinic.scss';
import { Breadcrumb, Flex, Input, Pagination, Select } from 'antd';
import { ClinicService } from '../../../../services/clinic.service';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    clinicListState,
    clinicListValue,
} from '../../../../stores/clinicAtom';
import { useEffect, useState } from 'react';
import { SearchProps } from 'antd/es/input';
import axios from 'axios';
import { ClinicCard } from '../components/ClinicCard';
import { useFetchDataWithPaginationProps } from '../../../../hooks';
import { Clinic } from '../../../../models/clinic';
const { Search } = Input;
const ViewClinic = () => {
    const [optionsFilter, setOptionsFilter] = useState<any>({
        location: null,
        name: null,
    });
    const apiEndpoint = '/clinic/view';
    const { data, loading, error, pageCount, resetFirstFetch } =
        useFetchDataWithPaginationProps<Clinic>(apiEndpoint, optionsFilter);
    // const [pagination, setPagination] = useRecoilState(paginationState);
    const [provinces, setProvinces] = useState([
        { province_id: 0, province_name: '' },
    ]);

    const setClinics = useSetRecoilState(clinicListState);
    const clinics = useRecoilValue(clinicListValue);

    const onSearch: SearchProps['onSearch'] = (value, _e) => {
        const newOptions = { ...optionsFilter, name: value };
        setOptionsFilter(newOptions);
    };
    const handleChangeLocation = (value: string) => {
        let province: string = '';
        const cityStr = 'thành phố';
        const provinceStr = 'tỉnh';
        if (value) {
            if (value.toLowerCase().includes('thành phố')) {
                province = value.slice(cityStr.length, value.length);
            }
            if (value.toLowerCase().includes('tỉnh')) {
                province = value.slice(provinceStr.length, value.length);
            }
            const newOptions = { ...optionsFilter, location: province.trim() };
            setOptionsFilter(newOptions);
        } else {
            const newOptions = { ...optionsFilter, location: null };
            setOptionsFilter(newOptions);
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
                    'https://vapi.vnappmob.com/api/v2/province'
                );
                setProvinces(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };
        getProvinces();

        window.scrollTo(0, 0);
    }, [optionsFilter]);

    useEffect(() => {
        setClinics(data);
    }, [data]);

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

            <Flex className="group__search  d-flex justify-content-between align-items-center shadow rounded p-3 mt-3">
                <div className="col-5">
                    <Select
                        className=""
                        style={{ width: '48%' }}
                        onChange={handleChangeLocation}
                        showSearch
                        placeholder="Chọn tỉnh thành"
                        optionFilterProp="children"
                        allowClear
                    >
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
            {loading ? (
                <p className="fs-6 fw-bold text-center mt-4">
                    Đang tải dữ liệu ...
                </p>
            ) : error ? (
                <p className="fs-6 fw-bold text-center mt-4">{error}</p>
            ) : clinics?.length > 0 ? (
                <>
                    <ClinicCard
                        clinics={clinics}
                        handleUpdateViewsClinic={handleUpdateViewsClinic}
                    />
                    {/* {pagination.pageCount > 1 && (
                        <Pagination
                            current={pagination.pageIndex}
                            pageSize={pagination.pageSize}
                            showSizeChanger
                            pageSizeOptions={['4', '8', '12', '16', '20']}
                            onChange={changePage}
                            align="center"
                            className="mt-3"
                            total={pagination.pageCount * pagination.pageSize}
                        ></Pagination>
                    )} */}
                </>
            ) : (
                <>Không có cơ sở y tế nào!</>
            )}
        </div>
    );
};
export default ViewClinic;
