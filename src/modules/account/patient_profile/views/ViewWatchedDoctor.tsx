import { useEffect, useState } from 'react';
import { Doctor } from '../../../../models/doctor';
import { Button, Card, Row, Col, Image, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { doctorService } from '../../../../services/doctorService';
const ViewWatchedDoctor = () => {
    const navigate = useNavigate();
    const [watchedDoctors, setWatchedDoctors] = useState<Doctor[]>([]);
    const setDoctor = useSetRecoilState(doctorState);

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
        window.scrollTo(0, 0);
    }, []);

    return (
        <PatientProfileLayout breadcrumb="Bác sĩ đã xem">
            <div className="block-watched-doctor">
                <Row className="block-container mt-4" gutter={24}>
                    {watchedDoctors.length > 0 ? (
                        watchedDoctors?.map((doctor: Doctor) => {
                            return (
                                <Col className=" mb-3" span={8}>
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
