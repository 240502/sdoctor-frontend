import { Col, Row, Image, Button, Flex } from 'antd';
import { Service } from '../models/service';
import { useNavigate } from 'react-router-dom';
import { DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { ServiceService } from '../services/serviceService';

const ServiceCard = ({ services }: any) => {
    const navigate = useNavigate();
    const updateViewService = async (id: number) => {
        try {
            const res = await ServiceService.updateView(id);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    return (
        <Row gutter={[24, 24]} className="cards">
            {services?.map((service: Service) => {
                return (
                    <Col span={6} className="card-item" key={service?.name}>
                        <div className="card-container flex-grow-1 rounded border border-1 ">
                            <div className="service-image">
                                <Image
                                    onClick={() => {
                                        navigate(
                                            '/service/detail/' + service?.id
                                        );
                                        updateViewService(Number(service?.id));
                                    }}
                                    preview={false}
                                    src={service.image}
                                    className="rounded"
                                ></Image>
                            </div>
                            <div className="card-body">
                                <h6
                                    className="doctor-name text-center mt-1"
                                    onClick={() => {
                                        navigate(
                                            '/service/detail/' + service?.id
                                        );
                                        updateViewService(Number(service?.id));
                                    }}
                                >
                                    {service.name}
                                </h6>
                                <p className="mb-0 opacity-75 text-center mb-3">
                                    {service.categoryName}
                                </p>
                                <div className="clinic-info">
                                    <p className="mb-1">
                                        <DollarOutlined className="me-1" /> Giá:{' '}
                                        <span className="text-success fw-bold mb-1">
                                            {service.price.toLocaleString(
                                                undefined
                                            )}{' '}
                                            VNĐ
                                        </span>
                                    </p>
                                    <p className="mb-1">
                                        <i className="fa-regular fa-hospital me-1"></i>
                                        {service.clinicName}
                                    </p>

                                    <p>
                                        <EnvironmentOutlined className="me-1" />{' '}
                                        {service.location}
                                    </p>
                                </div>
                            </div>
                            <Flex className="group-button justify-content-center mt-3">
                                <Button
                                    className="booking-btn"
                                    onClick={() => {
                                        navigate(
                                            '/service/detail/' + service?.id
                                        );
                                        updateViewService(Number(service?.id));
                                    }}
                                >
                                    Đặt lịch hẹn
                                </Button>
                            </Flex>
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};
export default ServiceCard;
