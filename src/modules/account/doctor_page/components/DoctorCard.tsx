import { Col, Row, Image, Button, Tag } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { Doctor } from '../../../../models/doctor';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { addWatchedDoctor } from '../../../../utils/doctor';

export const DoctorCard = ({ doctors, handleUpdateViewsDoctor }: any) => {
    const navigate = useNavigate();
    const setDoctor = useSetRecoilState(doctorState);
    return (
        <Row gutter={[16, 16]} className="cards">
            {doctors.map((doctor: Doctor) => {
                return (
                    <Col
                        span={6}
                        className="card-item "
                        key={doctor?.doctor_id}
                    >
                        <div className="card-container flex-grow-1 rounded border border-1 position-relative shadow">
                            {doctor?.average_star && (
                                <div className="star text-end ">
                                    <StarFilled className="text-warning " />
                                    <span className="score d-inline-block ms-2">
                                        {doctor?.average_star
                                            ?.toString()
                                            .slice(0, 3)}
                                        /5
                                    </span>
                                </div>
                            )}
                            <div className="doctor-image col-3 text-center m-auto">
                                <Image
                                    onClick={() => {
                                        navigate(
                                            '/doctor/detail/' +
                                                doctor?.doctor_id
                                        );
                                        handleUpdateViewsDoctor(
                                            doctor?.doctor_id
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
                                        '/doctor/detail/' + doctor?.doctor_id
                                    );
                                    handleUpdateViewsDoctor(doctor?.doctor_id);
                                    addWatchedDoctor(doctor);
                                }}
                            >
                                {doctor.full_name}
                            </h6>
                            <p className="mb-0 opacity-75 text-center mb-3">
                                {doctor.major_name}
                            </p>
                            <div className="text-center mb-4">
                                <Tag color="blue" title="Tư vấn trực tiêp">
                                    <i className="fa-solid fa-stethoscope"></i>{' '}
                                    Tư vấn trực tiếp
                                </Tag>
                            </div>

                            <div className="clinic-info">
                                <p className="mb-1">
                                    <i className="fa-regular fa-hospital me-2"></i>
                                    {doctor.clinic_name}
                                </p>

                                <p>
                                    <EnvironmentOutlined></EnvironmentOutlined>{' '}
                                    {doctor.location}
                                </p>
                                <div className="button text-center">
                                    <Button
                                        className="booking-btn w-75"
                                        onClick={() => {
                                            console.log('doctor', doctor);
                                            navigate('/booking-appointment');
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
            })}
        </Row>
    );
};
