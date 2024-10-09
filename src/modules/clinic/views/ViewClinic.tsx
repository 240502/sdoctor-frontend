import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import '@/assets/scss/clinic.scss';

import { Breadcrumb, Button, Divider, Image, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { ClinicService } from '../../../services/clinicService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { clinicListState, clinicListValue } from '../../../stores/clinicAtom';
import { useEffect, useState, useRef } from 'react';
import { SearchProps } from 'antd/es/input';
import { Clinic } from '../../../models/clinic';
import { baseURL } from '../../../constants/api';
import ReactPaginate from 'react-paginate';
const { Search } = Input;
const ViewClinic = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [location, setLocation] = useState<string>();
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
        const data = { pageIndex, pageSize, name: value };
        console.log(data);
        viewClinic(data);
    };
    const handleChangeLocation = (value: string) => {
        console.log(`selected ${value}`);
        setLocation(value);
    };
    const changePageSize = (value: any) => {
        setPageSize(Number(value));
    };
    const handlePageClick = (event: any) => {
        console.log(event.selected);
        setPageIndex(event.selected + 1);
    };
    useEffect(() => {
        const data = {
            pageIndex: pageIndex,
            pageSize: pageSize,
        };
        viewClinic(data);
    }, [pageIndex, pageSize]);
    return (
        <div className="container mt-5 mb-5">
            <Breadcrumb
                items={[
                    {
                        href: '',
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
                        placeholder="Chọn chuyên ngành"
                        optionFilterProp="children"
                        defaultValue={'0'}
                    >
                        <Select.Option value={'0'}>
                            Chọn tỉnh thành
                        </Select.Option>
                        {/* {?.map((major: Major) => {
                            return (
                                <Select.Option
                                    key={Number(major.id)}
                                    value={major.id}
                                >
                                    {major.name}
                                </Select.Option>
                            );
                        })} */}
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
                                            to=""
                                            className="d-inline-block"
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
                                            to="/"
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
                <p>Không tồn tại cơ sở y tế nào</p>
            )}
        </div>
    );
};
export default ViewClinic;
