import { Col, Row, Image, Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { Service } from '../../../../models/medical_package';

const ServiceCard = ({
    services,
    onClickEditButton,
    onClickDeleteButton,
}: any) => {
    const navigate = useNavigate();
    return (
        <Row gutter={[24, 24]} className="cards">
            {services?.map((service: Service) => {
                return (
                    <Col span={6} className="card-item" key={service?.name}>
                        <div className="card-container rounded border border-1 ">
                            <div className="service-image">
                                <Image
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
                                        // handleUpdateViewsDoctor(
                                        //     doctor?.doctor_id
                                        // );
                                        // addWatchedDoctor(doctor);
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
                            <Flex className="group-button justify-content-between pb-3">
                                <Button
                                    className="border-0 text-success"
                                    onClick={() => {
                                        onClickEditButton(service);
                                    }}
                                >
                                    <EditOutlined /> Sửa
                                </Button>
                                <Button
                                    className="border-0 text-danger"
                                    onClick={() => onClickDeleteButton(service)}
                                >
                                    <DeleteOutlined /> Xóa
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
