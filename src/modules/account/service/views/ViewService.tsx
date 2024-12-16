import { useEffect, useRef, useState } from 'react';
import { ServiceService } from '../../../../services/serviceService';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    serviceListState,
    serviceListValue,
} from '../../../../stores/servicesAtom';
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
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [pageCount, setPageCount] = useState<number>(0);
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
    const getServices = async () => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                ...filterOptions,
            };
            const res = await ServiceService.viewService(data);
            console.log(res);
            setServices(res?.data);
            setPageCount(res?.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setServices([]);
            setPageCount(0);
        }
    };
    useEffect(() => {
        getAllClinic();
        getAllServiceCategory();
    }, []);
    useEffect(() => {
        getServices();
    }, [pageIndex, pageSize, filterOptions]);
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
                {services?.length ? (
                    <ServiceCard services={services} />
                ) : (
                    <p className="text-center">Không có dịch vụ nào!</p>
                )}
                {pageCount > 1 && (
                    <Pagination
                        current={pageIndex}
                        pageSize={pageSize}
                        total={pageCount * pageSize}
                        showSizeChanger
                        pageSizeOptions={['4', '8', '12', '16', '20']}
                        onChange={(current: number, size: number) => {
                            if (size !== pageSize) {
                                setPageSize(size);
                                setPageIndex(1);
                            } else {
                                setPageIndex(current);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default ViewService;
