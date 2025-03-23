import { Col, Row, Image, Button, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../stores/doctorAtom';
import { Doctor } from '../models/doctor';
import { addWatchedDoctor } from '../utils/doctor';

const DoctorCard = ({ doctors, handleUpdateViewsDoctor }: any) => {
    const navigate = useNavigate();
    const setDoctor = useSetRecoilState(doctorState);
    console.log('doctors', doctors);
    return (
        <Row gutter={[24, 24]} className="cards h-100">
            {doctors?.length > 0 ? (
                doctors?.map((doctor: Doctor) => {
                    return (
                        <Col
                            span={8}
                            className="card-item"
                            key={doctor?.fullName}
                        >
                            <div className="card-container p-3 rounded border border-1 h-100 d-flex flex-column ">
                                <div className="doctor-image col-3 text-center m-auto">
                                    <Image
                                        onClick={() => {
                                            navigate(
                                                '/doctor/detail/' +
                                                    doctor?.doctorId
                                            );
                                            handleUpdateViewsDoctor(
                                                doctor?.doctorId
                                            );
                                            addWatchedDoctor(doctor);
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
                                            '/doctor/detail/' + doctor?.doctorId
                                        );
                                        handleUpdateViewsDoctor(
                                            doctor?.doctorId
                                        );
                                        addWatchedDoctor(doctor);
                                    }}
                                >
                                    {doctor.fullName}
                                </h6>
                                <p className="mb-0 opacity-75 text-center mb-3">
                                    {doctor.majorName}
                                </p>
                                <div className="text-center mb-5">
                                    <Tag color="blue" title="Tư vấn trực tiêp">
                                        <i className="fa-solid fa-stethoscope"></i>{' '}
                                        Tư vấn trực tiếp
                                    </Tag>
                                </div>
                                <div className="clinic-info p-3">
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
                    );
                })
            ) : (
                <p>Không có bác sĩ nào!</p>
            )}
        </Row>
    );
};

export default DoctorCard;
