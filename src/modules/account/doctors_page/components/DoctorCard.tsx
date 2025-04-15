import { Col, Row, Image, Button, Tag, Flex } from 'antd';
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
        <Row gutter={[24, 24]} className="cards">
            {doctors.map((doctor: Doctor) => {
                return (
                    <Col
                        span={8}
                        key={doctor?.doctorId}
                        className="card-item d-flex "
                    >
                        <Flex
                            vertical
                            className="card-container align-items-stretch rounded border border-1 position-relative shadow p-4 w-100 h-100 d-flex flex-column"
                        >
                            {doctor?.averageStar && (
                                <div className="star text-end">
                                    <StarFilled className="text-warning" />
                                    <span className="score d-inline-block ms-2">
                                        {doctor?.averageStar
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
                                            '/doctor/detail/' + doctor?.doctorId
                                        );
                                        handleUpdateViewsDoctor(
                                            doctor?.doctorId
                                        );
                                        addWatchedDoctor(doctor);
                                    }}
                                    className="rounded-circle"
                                    preview={false}
                                    src={doctor.image}
                                />
                            </div>
                            <h6
                                className="doctor-name text-center mt-3"
                                onClick={() => {
                                    navigate(
                                        '/doctor/detail/' + doctor?.doctorId
                                    );
                                    handleUpdateViewsDoctor(doctor?.doctorId);
                                    addWatchedDoctor(doctor);
                                }}
                            >
                                {doctor.fullName}
                            </h6>
                            <p className="mb-0 opacity-75 text-center mb-3">
                                {doctor.majorName}
                            </p>
                            <div className="text-center mb-4">
                                <Tag color="blue" title="Tư vấn trực tiếp">
                                    <i className="fa-solid fa-stethoscope"></i>{' '}
                                    Tư vấn trực tiếp
                                </Tag>
                            </div>

                            <div className="clinic-info flex-grow-1 d-flex flex-column justify-content-between p-3">
                                <p className="mb-1">
                                    <i className="fa-regular fa-hospital me-2"></i>
                                    {doctor.clinicName}
                                </p>
                                <p>
                                    <EnvironmentOutlined /> {doctor.location}
                                </p>
                                <div className="button text-center">
                                    <Button
                                        className="booking-btn w-75 fs-6 fw-normal"
                                        onClick={() => {
                                            const queryParams =
                                                new URLSearchParams();
                                            console.log(
                                                'doctorId',
                                                doctor.doctorId
                                            );

                                            queryParams.append(
                                                'doctorId',
                                                doctor.doctorId.toString()
                                            );
                                            //navigate(
                                            //    `/booking-appointment?${queryParams}`
                                            //);
                                            //  setDoctor(doctor);
                                        }}
                                    >
                                        Đặt lịch bác sĩ
                                    </Button>
                                </div>
                            </div>
                        </Flex>
                    </Col>
                );
            })}
        </Row>
    );
};
