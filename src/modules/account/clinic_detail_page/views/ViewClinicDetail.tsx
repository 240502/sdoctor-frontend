import {
    Breadcrumb,
    Col,
    Divider,
    Image,
    Input,
    Pagination,
    Row,
    Select,
    Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../../../constants/api';
// import { ClinicService } from '../../../../services/clinic.service';
import parse from 'html-react-parser';
import '@/assets/scss/clinic.scss';
import { DoctorCard, ServiceCard } from '../../../../components';
import { Doctor } from '../../../../models/doctor';
// import { doctorService } from '../../../../services/doctor.service';
import {
    EnvironmentOutlined,
    HomeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
// import { BlockDescription } from '../components/BlockDescription';
// import { MajorService } from '../../../../services/major.service';
import { Major } from '../../../../models/major';
import { Service } from '../../../../models/service';
// import { ServiceService } from '../../../../services/medical_package.service';
// import { ServiceCategoryService } from '../../../../services/service_category.service';
import { ServiceCategory } from '../../../../models/category_services';
import { useFetchClinicById } from '../../../../hooks';

const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const [current, setCurrent] = useState<string>('0');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [serviceCategories, setServiceCategories] = useState<
        ServiceCategory[]
    >([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [majorId, setMajorId] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const [searchContent, setSearchContent] = useState<string>('');
    const [majors, setMajors] = useState<Major[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>('1');
    const { data, error, isFetching } = useFetchClinicById(Number(id));
    // const handleGetClinicById = async (id: number) => {
    //     try {
    //         const clinic = clinics.find((item: Clinic) => item.id === id);
    //         if (clinic) {
    //             setClinic(clinic);
    //         } else {
    //             const res = await ClinicService.getClinicById(id);
    //             setClinic(res);
    //         }
    //     } catch (err: any) {
    //         throw new Error(err.message);
    //     }
    // };
    console.log('error', error);
    useEffect(() => {
        console.log('data', data);
    }, [data]);
    const handleFilterDoctor = () => {
        if (searchContent === '') {
            setFilteredDoctors(doctors);
        } else {
            const filteredDoctors = doctors.filter((doc: Doctor) =>
                doc.fullName.includes(searchContent)
            );
            setFilteredDoctors(filteredDoctors);
        }
    };
    // const getAllMajor = async () => {
    //     try {
    //         const majorList = await MajorService.getAllMajor();
    //         setMajors(majorList);
    //     } catch (err: any) {
    //         console.log(err.message);
    //     }
    // };
    // const getDoctors = async () => {
    //     try {
    //         const data = {
    //             pageIndex: pageIndex,
    //             pageSize: pageSize,
    //             clinicId: Number(id),
    //             majorId: majorId === 0 ? null : Number(majorId),
    //         };
    //         const res = await doctorService.viewDoctorForClient(data);
    //         setDoctors(res.data);
    //     } catch (err: any) {
    //         setDoctors([]);
    //         console.log(err.message);
    //     }
    // };
    // const getService = async () => {
    //     try {
    //         const data = {
    //             pageIndex: pageIndex,
    //             pageSize: pageSize,
    //             categoryId: categoryId,
    //             clinicId: Number(id),
    //         };
    //         const result = await ServiceService.viewService(data);
    //         setServices(result?.data);
    //         setPageCount(result?.pageCount);
    //     } catch (err: any) {
    //         setServices([]);
    //         setPageCount(0);
    //         console.log(err.message);
    //     }
    // };
    const handleFilterService = () => {
        if (searchContent === '') {
            setFilteredServices(services);
        } else {
            const filteredServices = services.filter((service: Service) =>
                service.name.includes(searchContent)
            );
            setFilteredServices(filteredServices);
        }
    };
    // const handleUpdateViewsDoctor = async (id: number) => {
    //     try {
    //         const res = await doctorService.updateViewsDoctor(id);
    //     } catch (err: any) {
    //         console.log(err.message);
    //     }
    // };

    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
    };
    // const getAllServiceCategory = async () => {
    //     try {
    //         const res = await ServiceCategoryService.getAll();
    //         setServiceCategories(res);
    //     } catch (err: any) {
    //         setServiceCategories([]);

    //         console.log(err.message);
    //     }
    // };
    useEffect(() => {
        // handleGetClinicById(Number(id));
        window.scrollTo(0, 0);
    }, [id]);
    useEffect(() => {
        handleFilterDoctor();
    }, [searchContent, doctors]);
    useEffect(() => {
        handleFilterService();
    }, [searchContent, services]);
    useEffect(() => {
        // if (Number(selectedKey) === 2) {
        //     getDoctors();
        //     getAllMajor();
        // }
        // if (Number(selectedKey) === 3) {
        //     getAllServiceCategory();
        //     getService();
        // }
    }, [majorId, selectedKey]);
    useEffect(() => {
        // getService();
    }, [categoryId]);
    useEffect(() => {
        // getDoctors();
    }, [majorId]);
    return (
        <div className=" clinic-detail ">
            <div className="position-relative container mt-4 mb-4">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Chi tiết cơ sở y tế' },
                    ]}
                />
                <div
                    className="image-cover position-relative overflow-hidden mt-3"
                    style={{ maxHeight: '400px' }}
                >
                    <img
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                        }}
                        // className="position-absolute start-0 end-0 bottom-0"
                        src={
                            data?.coverImage?.includes('cloudinary')
                                ? clinic?.coverImage
                                : baseURL + clinic?.coverImage
                        }
                    />
                </div>
                <Row className="clinic-info align-items-center" gutter={24}>
                    <Col
                        span={4}
                        className="rounded-circle clinic-image text-center"
                    >
                        <Image
                            src={clinic?.avatar}
                            preview={false}
                            width={128}
                            className="rounded-circle shadow"
                        ></Image>
                    </Col>
                    <Col span={20} className="pt-3">
                        <h5>{clinic?.name}</h5>
                        <p className="opacity-75">
                            <EnvironmentOutlined /> {clinic?.location}
                        </p>
                    </Col>
                </Row>
            </div>
            <Divider className="divider"></Divider>
            <div className="container">
                <div className="tabs">
                    <Tabs
                        onChange={(key: string) => {
                            setSelectedKey(key);
                        }}
                        className=""
                        onClick={handleChangeMenu}
                        items={[
                            {
                                key: '1',
                                label: 'Giới thiệu chung',
                                children: (
                                    <BlockDescription
                                        description={parse(
                                            String(clinic?.description)
                                        )}
                                    />
                                ),
                            },
                            {
                                key: '2',
                                label: 'Bác sĩ',
                                children: (
                                    <div className="mt-3 mb-3">
                                        <Row className="group-filter-options justify-content-between shadow p-3 rounded">
                                            <Col span={4}>
                                                <Select
                                                    className="w-100"
                                                    placeholder="Chọn chuyên khoa"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    allowClear
                                                    onChange={(
                                                        value: number
                                                    ) => {
                                                        setMajorId(value);
                                                    }}
                                                >
                                                    {majors.map(
                                                        (major: Major) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        major.name
                                                                    }
                                                                    value={
                                                                        major.id
                                                                    }
                                                                >
                                                                    {' '}
                                                                    {major.name}
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </Col>
                                            <Col
                                                span={4}
                                                className="position-relative group-search"
                                            >
                                                <Input
                                                    placeholder="Tìm kiếm"
                                                    onChange={(e: any) => {
                                                        setSearchContent(
                                                            e.target.value
                                                        );
                                                    }}
                                                ></Input>
                                                <SearchOutlined className="position-absolute search-icon"></SearchOutlined>
                                            </Col>
                                        </Row>
                                        <DoctorCard
                                            doctors={filteredDoctors}
                                            handleUpdateViewsDoctor={
                                                handleUpdateViewsDoctor
                                            }
                                        />
                                        {pageCount > 1 && (
                                            <Pagination
                                                current={pageIndex}
                                                pageSize={pageSize}
                                                total={pageSize * pageCount}
                                                showSizeChanger
                                                pageSizeOptions={[
                                                    '4',
                                                    '8',
                                                    '12',
                                                    '16',
                                                    '20',
                                                ]}
                                                onChange={(
                                                    current: number,
                                                    size: number
                                                ) => {
                                                    if (pageSize === size) {
                                                        setPageSize(size);
                                                        setPageIndex(1);
                                                    } else {
                                                        setPageIndex(current);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ),
                            },
                            {
                                key: '3',
                                label: 'Dịch vụ',
                                children: (
                                    <div className="mt-3 mb-3">
                                        <Row className="group-filter-options justify-content-between  shadow p-3 rounded">
                                            <Col span={4}>
                                                <Select
                                                    className="w-100"
                                                    placeholder="Chọn loại dịch vụ"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    allowClear
                                                    onChange={(
                                                        value: number
                                                    ) => {
                                                        setCategoryId(value);
                                                    }}
                                                >
                                                    {serviceCategories.map(
                                                        (
                                                            category: ServiceCategory
                                                        ) => {
                                                            return (
                                                                <Select.Option
                                                                    key={
                                                                        category.name
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {' '}
                                                                    {
                                                                        category.name
                                                                    }
                                                                </Select.Option>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                            </Col>
                                            <Col
                                                span={4}
                                                className="position-relative group-search"
                                            >
                                                <Input
                                                    placeholder="Tìm kiếm"
                                                    onChange={(e: any) => {
                                                        setSearchContent(
                                                            e.target.value
                                                        );
                                                    }}
                                                ></Input>
                                                <SearchOutlined className="position-absolute search-icon"></SearchOutlined>
                                            </Col>
                                        </Row>
                                        {services?.length > 0 ? (
                                            <ServiceCard
                                                services={filteredServices}
                                            />
                                        ) : (
                                            <p className="mt-3 text-center fw-bold fs-6">
                                                Chưa có dữ liệu!
                                            </p>
                                        )}
                                        {pageCount > 1 && (
                                            <Pagination
                                                current={pageIndex}
                                                pageSize={pageSize}
                                                total={pageSize * pageCount}
                                                showSizeChanger
                                                pageSizeOptions={[
                                                    '4',
                                                    '8',
                                                    '12',
                                                    '16',
                                                    '20',
                                                ]}
                                                onChange={(
                                                    current: number,
                                                    size: number
                                                ) => {
                                                    if (pageSize === size) {
                                                        setPageSize(size);
                                                        setPageIndex(1);
                                                    } else {
                                                        setPageIndex(current);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                    ></Tabs>
                </div>
            </div>
        </div>
    );
};

export default ViewClinicDetail;
