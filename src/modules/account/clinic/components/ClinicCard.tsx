import React from 'react';
import { Row, Button, Image, Col } from 'antd';
import { Clinic } from '../../../../models/clinic';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addWatchedClinic } from '../../../../utils/clinic';
export const ClinicCard = ({ clinics, handleUpdateViewsClinic }: any) => {
    const navigate = useNavigate();
    return (
        <Row gutter={[16, 16]} className="cards">
            {clinics.map((clinic: Clinic) => {
                return (
                    <Col span={6} className="card-item" key={clinic.id}>
                        <div className="card-container rounded border border-1 ">
                            <div className="clinic-image text-center m-auto">
                                <Image
                                    onClick={() => {
                                        navigate(
                                            '/clinic/detail/' + clinic?.id
                                        );
                                        handleUpdateViewsClinic(clinic?.id);
                                        addWatchedClinic(clinic);
                                    }}
                                    className="rounded-circle"
                                    preview={false}
                                    src={clinic.avatar}
                                ></Image>
                            </div>
                            <h6
                                className="clinic-name text-center mt-2 mb-5"
                                onClick={() => {
                                    navigate('/clinic/detail/' + clinic?.id);
                                    handleUpdateViewsClinic(clinic?.id);
                                    addWatchedClinic(clinic);
                                }}
                            >
                                {clinic.name}
                            </h6>

                            <div className="clinic-info">
                                <p>
                                    <EnvironmentOutlined /> {clinic.location}
                                </p>
                                <div className="button text-center">
                                    <Button
                                        className="booking-btn w-75"
                                        onClick={() => {
                                            navigate(
                                                '/clinic/detail/' + clinic?.id
                                            );
                                        }}
                                    >
                                        Đặt lịch bệnh viện
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
