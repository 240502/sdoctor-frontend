import parse from 'html-react-parser';
import { Row, Col, Button, Skeleton } from 'antd';
import { DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';

export const BlockDescription = ({ service, isFetching }: any) => {
    return (
        <Row gutter={24} className="service-detail">
            <Col span={18} className="border-end">
                <Skeleton active loading={isFetching}>
                    <div className="summary position-relative">
                        <h6 className="title">Về dịch vụ</h6>
                        <div className="content fs-6">
                            {parse(service?.summary)}
                        </div>
                    </div>
                </Skeleton>
                <Skeleton active loading={isFetching}>
                    <div className="preparation-process position-relative">
                        <h6 className="title">Quá trình chuẩn bị</h6>
                        <div className="content fs-6">
                            {parse(service?.preparationProcess)}
                        </div>
                    </div>
                </Skeleton>
                <Skeleton active loading={isFetching}>
                    <div className="service-detail position-relative">
                        <h6 className="title">Chi tiết dịch vụ</h6>
                        <div className="content fs-6">
                            {parse(service?.serviceDetail)}
                        </div>
                    </div>
                </Skeleton>
            </Col>
            <Col span={6} className="position-relative">
                <Skeleton active loading={isFetching}>
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
                                {service.clinicName}
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
                </Skeleton>
            </Col>
        </Row>
    );
};
