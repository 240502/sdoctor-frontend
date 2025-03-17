import { useEffect, useState } from 'react';
import { Doctor } from '../../../../models/doctor';
import { Button, Card, Row, Col, Image, Tag, Select, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import {
    EnvironmentOutlined,
    SearchOutlined,
    StarFilled,
} from '@ant-design/icons';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { doctorService } from '../../../../services/doctor.service';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { MajorService } from '../../../../services/major.service';
import { ClinicService } from '../../../../services/clinic.service';
const ViewWatchedDoctor = () => {
    const navigate = useNavigate();
    const [watchedDoctors, setWatchedDoctors] = useState<Doctor[]>([]);
    const setDoctor = useSetRecoilState(doctorState);
    const [majors, setMajors] = useState<Major[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [filterOptions, setFilterOptions] = useState<any>({
        clinicId: null,
        majorId: null,
        name: null,
    });
    const getAllClinic = async () => {
        try {
            const res = await ClinicService.viewClinic({});
            setClinics(res.data);
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
    const getWatchedDoctor = () => {
        const doctors = JSON.parse(
            localStorage.getItem('watchedDoctors') || '[]'
        );
        setWatchedDoctors(doctors);
    };
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getWatchedDoctor();
        getAllClinic();
        getAllMajor();
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        const handleFilterDoctor = () => {
            if (watchedDoctors.length > 0) {
                let doctorsCopy: Doctor[] = watchedDoctors;
                if (
                    filterOptions.clinicId ||
                    filterOptions.majorId ||
                    filterOptions.name
                ) {
                    if (filterOptions.clinicId) {
                        doctorsCopy = doctorsCopy.filter((doctor: Doctor) => {
                            return doctor.clinicId === filterOptions.clinicId;
                        });
                    }
                    if (filterOptions.majorId) {
                        doctorsCopy = doctorsCopy.filter((doctor: Doctor) => {
                            return doctor.majorId === filterOptions.majorId;
                        });
                    }
                    if (filterOptions.name && filterOptions.name?.length > 0) {
                        doctorsCopy = doctorsCopy.filter((doctor: Doctor) => {
                            return doctor.fullName.includes(filterOptions.name);
                        });
                    }
                    if (doctorsCopy?.length > 0) {
                        setFilteredDoctors(doctorsCopy);
                    } else {
                        setFilteredDoctors([]);
                    }
                } else {
                    setFilteredDoctors(watchedDoctors);
                }
            }
        };
        handleFilterDoctor();
    }, [filterOptions, watchedDoctors]);
    useEffect(() => {
        console.log('filtered doctors', filteredDoctors);
    }, [filteredDoctors]);
    return (
        <PatientProfileLayout breadcrumb="Bác sĩ đã xem">
            <div className="block-watched-doctor">
                <Row gutter={24} className="shadow p-3 rounded">
                    <Col span={12}>
                        <Select
                            placeholder="Chọn cơ sở y tế"
                            className="w-50"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            value={filterOptions.clinicId}
                            onChange={(value: number) =>
                                setFilterOptions({
                                    ...filterOptions,
                                    clinicId: value,
                                })
                            }
                        >
                            {clinics.map((clinic: Clinic) => {
                                return (
                                    <Select.Option
                                        value={clinic.id}
                                        key={clinic.id}
                                    >
                                        {clinic.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <Select
                            placeholder="Chọn chuyên ngành"
                            className="w-50 ps-3"
                            showSearch
                            allowClear
                            value={filterOptions.majorId}
                            onChange={(value: number) =>
                                setFilterOptions({
                                    ...filterOptions,
                                    majorId: value,
                                })
                            }
                        >
                            {majors.map((major: Major) => {
                                return (
                                    <Select.Option
                                        key={major.id}
                                        value={major.id}
                                    >
                                        {major.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col span={12} className="position-relative text-end">
                        <Input
                            className="w-75"
                            placeholder="Tìm kiếm..."
                            onChange={(e: any) =>
                                setFilterOptions({
                                    ...filterOptions,
                                    name: e.target.value,
                                })
                            }
                        />
                        <SearchOutlined
                            className="position-absolute top-50 translate-middle-y pe-none opacity-50"
                            style={{ right: '20px', cursor: 'pointer' }}
                        />
                    </Col>
                </Row>
                <Row className="block-container cards mt-3" gutter={24}>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors?.map((doctor: Doctor) => {
                            return (
                                <Col
                                    span={6}
                                    className="card-item"
                                    key={doctor?.doctorId}
                                >
                                    <div className="card-container flex-grow-1 rounded border border-1 position-relative">
                                        {doctor?.averageStar && (
                                            <div className="star text-end ">
                                                <StarFilled className="text-warning " />
                                                <span className="score d-inline-block ms-2">
                                                    {doctor?.averageStar
                                                        ?.toString()
                                                        .slice(0, 3)}
                                                    /5
                                                </span>
                                            </div>
                                        )}
                                        <div className="col-3 text-center m-auto">
                                            <Image
                                                onClick={() => {
                                                    navigate(
                                                        '/doctor/detail/' +
                                                            doctor?.doctorId
                                                    );
                                                    handleUpdateViewsDoctor(
                                                        doctor?.doctorId
                                                    );
                                                    // addWatchedDoctor(doctor);
                                                }}
                                                className="rounded-circle"
                                                preview={false}
                                                src={doctor.image}
                                            ></Image>
                                        </div>
                                        <h6
                                            className="doctor-name text-center mt-3"
                                            onClick={() => {
                                                navigate(
                                                    '/doctor/detail/' +
                                                        doctor?.doctorId
                                                );
                                                handleUpdateViewsDoctor(
                                                    doctor?.doctorId
                                                );
                                                // addWatchedDoctor(doctor);
                                            }}
                                        >
                                            {doctor.fullName}
                                        </h6>
                                        <p className="mb-0 opacity-75 text-center mb-3">
                                            {doctor.majorName}
                                        </p>
                                        <div className="text-center mb-4">
                                            <Tag
                                                color="blue"
                                                title="Tư vấn trực tiêp"
                                            >
                                                <i className="fa-solid fa-stethoscope"></i>{' '}
                                                Tư vấn trực tiếp
                                            </Tag>
                                        </div>

                                        <div className="clinic-info">
                                            <p className="mb-1">
                                                <i className="fa-regular fa-hospital me-2"></i>
                                                {doctor.clinicName}
                                            </p>

                                            <p>
                                                <EnvironmentOutlined></EnvironmentOutlined>{' '}
                                                {doctor.location}
                                            </p>
                                            <div className="button text-center">
                                                <Button
                                                    className="booking-btn w-75"
                                                    onClick={() => {
                                                        navigate(
                                                            '/booking-appointment'
                                                        );
                                                        setDoctor(doctor);
                                                    }}
                                                >
                                                    Đặt lịch bác sĩ
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                // <Col className=" mb-3" span={6}>
                                //     <Card className="shadow" actions={[]}>
                                //         <Image
                                //             src={doctor.image}
                                //             onClick={() => {
                                //                 navigate(
                                //                     '/doctor/detail/' +
                                //                         doctor.doctorId
                                //                 );
                                //                 handleUpdateViewsDoctor(
                                //                     doctor.doctorId
                                //                 );
                                //             }}
                                //             preview={false}
                                //             className="rounded doctor-image"
                                //         ></Image>
                                //         <Tag color="blue" className="mt-2">
                                //             {doctor.majorName}
                                //         </Tag>
                                //         <h6 className="mt-2">
                                //             <Link
                                //                 className="text-decoration-none text-dark"
                                //                 to={
                                //                     '/doctor/detail/' +
                                //                     doctor.doctorId
                                //                 }
                                //                 onClick={() => {
                                //                     handleUpdateViewsDoctor(
                                //                         doctor.doctorId
                                //                     );
                                //                 }}
                                //             >
                                //                 Bác sĩ. {doctor.fullName}
                                //             </Link>
                                //         </h6>
                                //         <div
                                //             className="location"
                                //             style={{ height: '60px' }}
                                //         >
                                //             <EnvironmentOutlined className="me-2" />
                                //             {doctor.location}
                                //         </div>
                                //         <div className="button-container text-center">
                                //             <Button
                                //                 className="mt-2 border-primary text-primary w-75 btn-book-now"
                                //                 onClick={() => {
                                //                     navigate(
                                //                         '/booking-appointment'
                                //                     );
                                //                     setDoctor(doctor);
                                //                 }}
                                //             >
                                //                 Đặt lịch ngay
                                //             </Button>
                                //         </div>
                                //     </Card>
                                // </Col>
                            );
                        })
                    ) : (
                        <p>Không có bác sĩ nào !</p>
                    )}
                </Row>
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedDoctor;
