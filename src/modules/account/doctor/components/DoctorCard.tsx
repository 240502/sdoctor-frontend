import { Col, Row, Image, Button, Card, Tag } from 'antd';
import { Doctor } from '../../../../models/doctor';
import { EnvironmentOutlined } from '@ant-design/icons';

export const DoctorCard = ({ doctors }: any) => {
    return (
        <Row gutter={[16, 16]} className="cards">
            {doctors.map((doctor: Doctor) => {
                return (
                    <Col span={6} className="card-item">
                        <div className="card-container rounded border border-1 ">
                            <div className="doctor-image col-3 text-center m-auto">
                                <Image
                                    className="rounded-circle"
                                    preview={false}
                                    src={doctor.image}
                                ></Image>
                            </div>
                            <h6 className="doctor-name text-center mt-3">
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
                                    {doctor.address}
                                </p>
                                <div className="button text-center">
                                    <Button className="booking-btn w-75">
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