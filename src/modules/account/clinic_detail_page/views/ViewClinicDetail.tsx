import {
    Breadcrumb,
    Col,
    Divider,
    Image,
    Input,
    Pagination,
    Row,
    Select,
    Skeleton,
    Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../../../constants/api';
// import { ClinicService } from '../../../../services/clinic.service';
import parse from 'html-react-parser';
import '@/assets/scss/clinic.scss';
// import { doctorService } from '../../../../services/doctor.service';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
// import { BlockDescription } from '../components/BlockDescription';
// import { MajorService } from '../../../../services/major.service';
// import { ServiceService } from '../../../../services/medical_package.service';
// import { ServiceCategoryService } from '../../../../services/service_category.service';
import { useFetchClinicById } from '../../../../hooks';
import DoctorsTab from '../components/DoctorsTab';
import MedicalPackage from '../components/MedicalPackage';

const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const [current, setCurrent] = useState<string>('0');

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

    const handleFilterDoctor = () => {
        // if (searchContent === '') {
        //     setFilteredDoctors(doctors);
        // } else {
        //     const filteredDoctors = doctors.filter((doc: Doctor) =>
        //         doc.fullName.includes(searchContent)
        //     );
        //     setFilteredDoctors(filteredDoctors);
        // }
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
        // if (searchContent === '') {
        //     setFilteredServices(services);
        // } else {
        //     const filteredServices = services.filter((service: Service) =>
        //         service.name.includes(searchContent)
        //     );
        //     setFilteredServices(filteredServices);
        // }
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
    // useEffect(() => {
    //     handleFilterDoctor();
    // }, [searchContent, doctors]);
    // useEffect(() => {
    //     handleFilterService();
    // }, [searchContent, services]);
    // useEffect(() => {
    //     // if (Number(selectedKey) === 2) {
    //     //     getDoctors();
    //     //     getAllMajor();
    //     // }
    //     // if (Number(selectedKey) === 3) {
    //     //     getAllServiceCategory();
    //     //     getService();
    //     // }
    // }, [majorId, selectedKey]);
    // useEffect(() => {
    //     // getService();
    // }, [categoryId]);
    // useEffect(() => {
    //     // getDoctors();
    // }, [majorId]);
    return (
        <Skeleton active loading={isFetching}>
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
                                    ? data.coverImage
                                    : baseURL + data?.coverImage
                            }
                        />
                    </div>
                    <Row className="clinic-info align-items-center" gutter={24}>
                        <Col
                            span={4}
                            className="rounded-circle clinic-image text-center"
                        >
                            <Image
                                src={data?.avatar}
                                preview={false}
                                width={128}
                                className="rounded-circle shadow"
                            ></Image>
                        </Col>
                        <Col span={20} className="pt-3">
                            <h5>{data?.name}</h5>
                            <p className="opacity-75">
                                <EnvironmentOutlined /> {data?.location}
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
                                        <>{parse(String(data?.description))}</>
                                    ),
                                },
                                {
                                    key: '2',
                                    label: 'Bác sĩ',
                                    children: (
                                        <DoctorsTab clinicId={Number(id)} />
                                    ),
                                },
                                {
                                    key: '3',
                                    label: 'Dịch vụ',
                                    children: (
                                        <MedicalPackage clinicId={Number(id)} />
                                    ),
                                },
                            ]}
                        ></Tabs>
                    </div>
                </div>
            </div>
        </Skeleton>
    );
};

export default ViewClinicDetail;
