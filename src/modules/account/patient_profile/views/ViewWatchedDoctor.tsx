import { useEffect, useState } from 'react';
import { Doctor } from '../../../../models/doctor';
import { Button, Card, Row, Col, Image, Tag, Select, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { doctorService } from '../../../../services/doctorService';
import { Major } from '../../../../models/major';
import { Clinic } from '../../../../models/clinic';
import { MajorService } from '../../../../services/majorService';
import { ClinicService } from '../../../../services/clinicService';
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
                            return doctor.clinic_id === filterOptions.clinicId;
                        });
                    }
                    if (filterOptions.majorId) {
                        doctorsCopy = doctorsCopy.filter((doctor: Doctor) => {
                            return doctor.major_id === filterOptions.majorId;
                        });
                    }
                    if (filterOptions.name && filterOptions.name?.length > 0) {
                        doctorsCopy = doctorsCopy.filter((doctor: Doctor) => {
                            return doctor.full_name.includes(
                                filterOptions.name
                            );
                        });
                    }
                    console.log(filterOptions);
                    console.log('doctorsCopy', doctorsCopy);

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
                <Row className="block-container mt-3" gutter={24}>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors?.map((doctor: Doctor) => {
                            return (
                                <Col className=" mb-3" span={6}>
                                    <Card className="shadow" actions={[]}>
                                        <Image
                                            src={doctor.image}
                                            onClick={() => {
                                                navigate(
                                                    '/doctor/detail/' +
                                                        doctor.doctor_id
                                                );
                                                handleUpdateViewsDoctor(
                                                    doctor.doctor_id
                                                );
                                            }}
                                            preview={false}
                                            className="rounded object-fit-cover doctor-image"
                                        ></Image>
                                        <Tag color="blue" className="mt-2">
                                            {doctor.major_name}
                                        </Tag>
                                        <h6 className="mt-2">
                                            <Link
                                                className="text-decoration-none text-dark"
                                                to={
                                                    '/doctor/detail/' +
                                                    doctor.doctor_id
                                                }
                                                onClick={() => {
                                                    handleUpdateViewsDoctor(
                                                        doctor.doctor_id
                                                    );
                                                }}
                                            >
                                                Bác sĩ. {doctor.full_name}
                                            </Link>
                                        </h6>
                                        <div
                                            className="location"
                                            style={{ height: '60px' }}
                                        >
                                            <EnvironmentOutlined className="me-2" />
                                            {doctor.location}
                                        </div>
                                        <div className="button-container text-center">
                                            <Button
                                                className="mt-2 border-primary text-primary w-75 btn-book-now"
                                                onClick={() => {
                                                    navigate(
                                                        '/booking-appointment'
                                                    );
                                                    setDoctor(doctor);
                                                }}
                                            >
                                                Đặt lịch ngay
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
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
