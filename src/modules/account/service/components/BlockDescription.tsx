import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { Row, Col, Button } from 'antd';
import { DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';

export const BlockDescription = ({ service }: any) => {
    return (
        <Row gutter={24} className="service-detail">
            <Col span={18}>
                <div className="summary position-relative">
                    <h6 className="title">Về dịch vụ</h6>
                    <div className="content fs-6">
                        {parse(service?.summary)}
                    </div>
                </div>
                <div className="preparation-process position-relative">
                    <h6 className="title">Quá trình chuẩn bị</h6>
                    <div className="content fs-6">
                        {parse(service?.preparation_process)}
                    </div>
                </div>
                <div className="service-detail position-relative">
                    <h6 className="title">Chi tiết dịch vụ</h6>
                    <div className="content fs-6">
                        {parse(service?.service_detail)}
                    </div>
                </div>
            </Col>
            <Col span={6} className="position-relative">
                <div className="card-container position-absolute">
                    <h6>{service.name}</h6>
                    <div className="body bg-white p-3 fs-6">
                        <p className="price">
                            <DollarOutlined />{' '}
                            <span className="text-success fw-bold">
                                {' '}
                                {service.price.toLocaleString()} VNĐ
                            </span>
                        </p>
                        <p className="clinic">
                            <i className="fa-regular fa-hospital me-1"></i>{' '}
                            {service.clinic_name}
                        </p>
                        <p className="clinic-location">
                            <EnvironmentOutlined /> {service.location}
                        </p>
                        <Button type="primary" className="w-100">
                            {' '}
                            Đặt lịch hẹn
                        </Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};
