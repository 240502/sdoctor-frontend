import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { serviceListState } from '../../../../stores/servicesAtom';
import {
    Row,
    Col,
    Breadcrumb,
    Select,
    Input,
    Button,
    Pagination,
    InputRef,
} from 'antd';
import '@/assets/scss/service.scss';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { ServiceCard } from '../../../../components';
import { Clinic } from '../../../../models/clinic';
import { ServiceCategory } from '../../../../models/category_services';
import { ClinicService } from '../../../../services/clinicService';
import { ServiceCategoryService } from '../../../../services/serviceCategoryService';
import { useFetchDataWithPaginationProps } from '../../../../hooks';
import { Service } from '../../../../models/service';

const ViewService = () => {
    const priceOptions = [
        { value: 'Dưới 1 triệu', key: 1, startPrice: 0, endPrice: 1000000 },
        {
            value: 'Từ 1 triệu đến 2 triệu',
            key: 2,
            startPrice: 1000000,
            endPrice: 2000000,
        },
        {
            value: 'Từ 2 triệu đến 3 triệu',
            key: 3,
            startPrice: 2000000,
            endPrice: 3000000,
        },
        {
            value: 'Từ 3 triệu đến 4 triệu',
            key: 4,
            startPrice: 3000000,
            endPrice: 4000000,
        },
        {
            value: 'Từ 4 triệu đến 5 triệu',
            key: 5,
            startPrice: 4000000,
            endPrice: 5000000,
        },
        {
            value: 'Trên 5 triệu',
            key: 6,
            startPrice: 5000000,
            endPrice: 999999999,
        },
    ];
    const apiEndpoint = '/service/view';
    const [services, setServices] = useRecoilState(serviceListState);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [filterOptions, setFilterOptions] = useState<any>({
        clinicId: null,
        startPrice: null,
        endPrice: null,
        categoryId: null,
        name: null,
    });
    const inputSearchRef = useRef<InputRef>(null);
    const { data, loading, error, changePage } =
        useFetchDataWithPaginationProps<Service>(apiEndpoint, filterOptions);
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
            setClinics([]);
        }
    };
    const getAllServiceCategory = async () => {
        try {
            const res = await ServiceCategoryService.getAll();
            setCategories(res);
        } catch (err: any) {
            console.log(err.message);
            setCategories([]);
        }
    };
    useEffect(() => {
        setServices(data);
    }, [data]);
    useEffect(() => {
        getAllClinic();
        getAllServiceCategory();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container view-service-container  mt-4 mb-4">
            <Breadcrumb
                items={[
                    { href: '/', title: <HomeOutlined /> },
                    { title: 'Dịch vụ' },
                ]}
            />
            <Row
                gutter={24}
                className="shadow rounded pt-3 pb-3 block-filter mt-3"
            >
                <Col span={6}>
                    <Select
                        placeholder="Chọn cơ sở y tế"
                        className="w-100 "
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        onChange={(value: number) => {
                            setFilterOptions({
                                ...filterOptions,
                                clinicId: value,
                            });
                        }}
                    >
                        {clinics.map((clinic: Clinic) => {
                            return (
                                <Select.Option
                                    value={clinic.id}
                                    key={clinic.name}
                                >
                                    {clinic.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Col>
                <Col span={5}>
                    <Select
                        placeholder="Chọn loại dịch vụ"
                        className="w-100"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        onChange={(value: number) => {
                            setFilterOptions({
                                ...filterOptions,
                                categoryId: value,
                            });
                        }}
                    >
                        {categories.map((category: ServiceCategory) => {
                            return (
                                <Select.Option
                                    value={category.id}
                                    key={category.name}
                                >
                                    {category.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Col>
                <Col span={5}>
                    <Select
                        placeholder="Chọn giá"
                        className="w-100"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        onChange={(value: number) => {
                            const price = priceOptions.find(
                                (item: any) => item.key === value
                            );
                            setFilterOptions({
                                ...filterOptions,
                                startPrice: price?.startPrice,
                                endPrice: price?.endPrice,
                            });
                        }}
                    >
                        {priceOptions.map((price: any) => {
                            return (
                                <Select.Option
                                    value={price.key}
                                    key={price.value}
                                >
                                    {price.value}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Col>
                <Col span={8} className="position-relative">
                    <SearchOutlined
                        style={{
                            left: '30px',
                        }}
                        className="position-absolute top-50 z-2 translate-middle icon-search"
                    />
                    <Input
                        className=" ps-4"
                        style={{ width: '70%' }}
                        ref={inputSearchRef}
                    ></Input>
                    <Button
                        type="primary"
                        className="ms-3"
                        onClick={() => {
                            console.log(
                                'value',
                                inputSearchRef?.current?.input?.value
                            );
                            setFilterOptions({
                                ...filterOptions,
                                name: inputSearchRef?.current?.input?.value,
                            });
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
            <div className="service-list mt-4">
                <h6>Danh sách dịch vụ</h6>
                {loading ? (
                    <p className="fs-6 fw-bold mt-4 text-center">
                        Đang tải dữ liệu ...
                    </p>
                ) : error ? (
                    <p className="mt-4 fs-6 fw-bold text-center">{error}</p>
                ) : services?.length ? (
                    <ServiceCard services={services} />
                ) : (
                    <p className="text-center">Không có dịch vụ nào!</p>
                )}
                {/* {pagination.pageCount > 0 && (
                    <Pagination
                        align="center"
                        className="mt-4"
                        current={pagination.pageIndex}
                        pageSize={pagination.pageSize}
                        total={pagination.pageCount * pagination.pageSize}
                        showSizeChanger
                        pageSizeOptions={['4', '8', '12', '16', '20']}
                        onChange={changePage}
                    />
                )} */}
            </div>
        </div>
    );
};
export default ViewService;
