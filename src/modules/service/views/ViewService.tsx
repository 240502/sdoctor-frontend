import { useState, useEffect, useRef } from 'react';
import { Button, Image, Input, InputRef, Select, notification } from 'antd';
import parse from 'html-react-parser';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { EnvironmentOutlined, RetweetOutlined } from '@ant-design/icons';
import { ServicesService } from '../../../services/servicesService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    serviceListState,
    serviceListValue,
} from '../../../stores/servicesAtom';
import { Services } from '../../../models/services';
import { baseURL } from '../../../constants/api';
import { BlockSchedule } from '../components/BlockScheudle';
import { Time } from '../../../models/time';
import { ModalOrderAppointment } from '../components/ModalOrderAppointment';
import { CategoryService } from '../../../models/category_services';
import { Clinic } from '../../../models/clinic';
import { CategoryServicesService } from '../../../services/category_servicesService';
import { ClinicService } from '../../../services/clinicService';
type NotificationType = 'success' | 'error';

const ViewService = () => {
    const [api, contextHolder] = notification.useNotification();

    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [service, setService] = useState<Services>();
    const [time, setTime] = useState<Time>();
    const [appointmentDate, setAppointmentDate] = useState<string>();
    const [categoryServices, setCategoryServices] = useState<CategoryService[]>(
        []
    );
    const [valueSearch, setValueSearch] = useState<string>('');
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const setServices = useSetRecoilState(serviceListState);
    const services = useRecoilValue(serviceListValue);
    const inputSearchRef = useRef<InputRef>(null);
    const [optionsFilter, setOptionsFilter] = useState<any>({
        location: null,
        name: null,
        categoryId: null,
        startPrice: null,
        endPrice: null,
        clinicId: null,
        priceId: null,
    });
    const dataCategoryPrice = [
        {
            id: 1,
            value: 'Dưới 1.000.000 đ',
            endPrice: 1000000,
            startPrice: null,
        },
        {
            id: 2,
            value: 'Từ 1.000.000 đ đến 5.000.000 đ',
            endPrice: 5000000,
            startPrice: 1000000,
        },
        {
            id: 3,
            value: 'Từ 5.000.000 đ đến 10.000.000 đ',
            endPrice: 10000000,
            startPrice: 5000000,
        },
        {
            id: 4,
            value: 'Trên 10.000.000 đ',
            endPrice: null,
            startPrice: 10000000,
        },
    ];
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };

    const [provinces, setProvinces] = useState([
        { province_id: 0, province_name: '' },
    ]);
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
        const newOptions = { ...optionsFilter, location: province.trim() };
        console.log(newOptions);

        setOptionsFilter(newOptions);
    };
    const handleChangeCategory = (value: any) => {
        const newOptions = {
            ...optionsFilter,
            categoryId: value !== '0' ? Number(value) : null,
        };
        console.log(newOptions);
        setOptionsFilter(newOptions);
    };
    const handleChangePrice = (value: any) => {
        if (value !== '0') {
            const price = dataCategoryPrice.find(
                (item: any) => item.id === Number(value)
            );
            const newOptions = {
                ...optionsFilter,
                startPrice: price?.startPrice,
                endPrice: price?.endPrice,
                priceId: price?.id,
            };
            console.log(newOptions);
            setOptionsFilter(newOptions);
        } else {
            const newOptions = {
                ...optionsFilter,
                startPrice: null,
                endPrice: null,
                priceId: null,
            };
            console.log(newOptions);
            setOptionsFilter(newOptions);
        }
    };
    const handleChangeClinic = (value: any) => {
        const newOptions = {
            ...optionsFilter,
            clinicId: value !== '0' ? Number(value) : null,
        };

        console.log(newOptions);

        setOptionsFilter(newOptions);
    };
    const getAllCategoryServices = async () => {
        try {
            const res = await CategoryServicesService.getAllCategoryServices();
            setCategoryServices(res);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getAllClinic = async () => {
        try {
            const data = {
                pageIndex: 0,
                pageSize: 0,
            };
            const res = await ClinicService.viewClinic(data);
            console.log(res);
            setClinics(res.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const loadData = async () => {
        try {
            const data = {
                pageIndex: 1,
                pageSize: 10,
                ...optionsFilter,
            };
            const res = await ServicesService.getServiceView(data);
            console.log(res);
            setPageCount(res.pageCount);
            setServices(res.data);
        } catch (err: any) {
            console.log(err.message);
            setServices([]);
        }
    };
    useEffect(() => {
        console.log(services);
    }, [services]);
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
        getAllCategoryServices();
        getAllClinic();
        getProvinces();
    }, []);
    useEffect(() => {
        loadData();
    }, [optionsFilter]);
    return (
        <>
            {contextHolder}
            <div className="position-relative ">
                <div className="banner">
                    <Image
                        preview={false}
                        src="https://cdn.bookingcare.vn/fo/w1920/2022/10/26/093216-bc.jpg"
                    />
                </div>
                <div className="background position-absolute top-0 start-0 end-0 bottom-0 z-1  bg-dark bg-gradient bg-opacity-50"></div>
                <div className="title position-absolute top-50 start-50  translate-middle z-2">
                    <h3 className="text-uppercase text-light ">
                        Khám tổng quát
                    </h3>
                </div>

                <div
                    className="container group__search position-absolute top-100 start-50  shadow-lg translate-middle z-2 bg-light bg-gradient p-3 col-6 m-auto border border-start-0 border-end-0 border-top-0"
                    style={{ width: '100%', maxHeight: '200px' }}
                >
                    <div className="group__input position-relative">
                        <Input
                            value={valueSearch}
                            ref={inputSearchRef}
                            onChange={(e: any) =>
                                setValueSearch(e.target.value)
                            }
                            placeholder="Tìm kiếm"
                            className="pt-2 pb-2"
                        />
                        <Button
                            type="primary"
                            className="position-absolute end-0 me-2  top-50  translate-middle-y"
                            onClick={() => {
                                console.log(
                                    inputSearchRef.current?.input?.value
                                );
                                if (
                                    inputSearchRef.current?.input?.value !== ''
                                ) {
                                    setOptionsFilter({
                                        ...optionsFilter,
                                        name: inputSearchRef.current?.input
                                            ?.value,
                                    });
                                    console.log(optionsFilter);
                                } else {
                                    setOptionsFilter({
                                        ...optionsFilter,
                                        name: null,
                                    });
                                }
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                    <div className="group__select mt-3 row justify-content-between">
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                onChange={handleChangeLocation}
                                // onSearch={onSearchMajor}
                                showSearch
                                placeholder="Chọn tỉnh"
                                optionFilterProp="children"
                                defaultValue={'0'}
                                value={
                                    optionsFilter.location === null
                                        ? '0'
                                        : optionsFilter.location
                                }
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
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                onChange={handleChangeCategory}
                                // onSearch={onSearchMajor}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                                value={
                                    optionsFilter.categoryId === null
                                        ? '0'
                                        : optionsFilter.categoryId
                                }
                            >
                                <Select.Option value={'0'}>
                                    Chọn danh mục
                                </Select.Option>
                                {categoryServices?.map(
                                    (category: CategoryService) => {
                                        return (
                                            <Select.Option
                                                key={Number(category.id)}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        </div>
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                onChange={handleChangePrice}
                                // onSearch={onSearchMajor}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                                value={
                                    optionsFilter.priceId === null
                                        ? '0'
                                        : optionsFilter.priceId
                                }
                            >
                                <Select.Option value={'0'}>
                                    Chọn mức giá
                                </Select.Option>
                                {dataCategoryPrice?.map((price: any) => {
                                    return (
                                        <Select.Option
                                            key={Number(price.id)}
                                            value={price.id}
                                        >
                                            {price.value}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                onChange={handleChangeClinic}
                                // onSearch={onSearchMajor}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                                value={
                                    optionsFilter.clinicId === null
                                        ? '0'
                                        : optionsFilter.clinicId
                                }
                            >
                                <Select.Option value={'0'}>
                                    Chọn cơ sở y tế
                                </Select.Option>
                                {clinics?.map((clinic: Clinic) => {
                                    return (
                                        <Select.Option
                                            key={Number(clinic.id)}
                                            value={clinic.id}
                                        >
                                            {clinic.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="group__item col text-end">
                            <Button
                                onClick={() => {
                                    setOptionsFilter({
                                        location: null,
                                        name: null,
                                        categoryId: null,
                                        startPrice: null,
                                        endPrice: null,
                                        clinicId: null,
                                        priceId: null,
                                    });
                                    console.log(inputSearchRef.current);
                                    setValueSearch('');
                                }}
                            >
                                <RetweetOutlined className="fs-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block__content container mt-5">
                <div className="row">
                    <h3 className="fs-5 mt-5">Gói nổi bật</h3>
                </div>
                {services.length > 0 ? (
                    services.map((service: Services) => {
                        return (
                            <div className="list__service">
                                <div className="service shadow-lg"></div>
                                <div
                                    className="list__item mb-3 p-3 border rounded"
                                    key={Number(service.id)}
                                >
                                    <div className="item_container d-flex pt-1">
                                        <div className="item__left col-6 d-flex border border-start-0 border-bottom-0 border-top-0 pe-3">
                                            <div className="col-3 text-center">
                                                <Link
                                                    to={
                                                        `/service/detail/` +
                                                        service.id
                                                    }
                                                >
                                                    <Image
                                                        preview={false}
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        className="doctor__image rounded"
                                                        src={
                                                            baseURL +
                                                            service.image
                                                        }
                                                    ></Image>
                                                </Link>

                                                <Link
                                                    to={
                                                        `/service/detail/` +
                                                        service.id
                                                    }
                                                    className="btn__more text-decoration-none mt-3"
                                                >
                                                    Xem thêm
                                                </Link>
                                            </div>
                                            <div className="col-9 doctor_info">
                                                <h3 className="doctor__name fs-5">
                                                    <Link
                                                        to={
                                                            `/service/detail/` +
                                                            service.id
                                                        }
                                                        className="text-decoration-none"
                                                    >
                                                        {service.name}
                                                    </Link>
                                                </h3>
                                                <div className="doctor__des ">
                                                    <div className="lh-lg">
                                                        {parse(
                                                            String(
                                                                service.description
                                                            )
                                                        )}
                                                    </div>
                                                    <p className="mt-1">
                                                        <EnvironmentOutlined className="fs-6 " />
                                                        {service.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item__right col-6 ps-3  border border-end-0 border-start-0 border-top-0">
                                            <BlockSchedule
                                                subscriberId={service.id}
                                                setIsModalOpen={setIsModalOpen}
                                                service={service}
                                                setService={setService}
                                                setTime={setTime}
                                                setAppointmentDate={
                                                    setAppointmentDate
                                                }
                                            />

                                            <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                                                <h6 className="opacity-75">
                                                    Địa chỉ phòng khám
                                                </h6>
                                                <h6 className="clinic__name">
                                                    {service.clinic_name}
                                                </h6>
                                                <p className="clinic__location fs-6">
                                                    {service.location}
                                                </p>
                                            </div>
                                            <div className="fee mt-3">
                                                <span className="opacity-75 fs-6 fw-bold">
                                                    Giá khám:
                                                </span>
                                                <span className="price fs-6 ms-2">
                                                    {service.price.toLocaleString(
                                                        undefined
                                                    )}
                                                    đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="fs-6 fw-bold text-center">
                        Không tồn tại gói khám nào !
                    </p>
                )}
            </div>
            {isModalOpen && (
                <ModalOrderAppointment
                    isModalOpen={isModalOpen}
                    service={service}
                    setIsModalOpen={setIsModalOpen}
                    time={time}
                    date={appointmentDate}
                    openNotificationWithIcon={openNotificationWithIcon}
                />
            )}
        </>
    );
};
export default ViewService;
