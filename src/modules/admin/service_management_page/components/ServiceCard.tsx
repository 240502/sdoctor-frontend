import { Col, Row, Image, Button, Flex } from 'antd';
import {
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { MedicalPackage } from '../../../../models/medical_package';
import { useState } from 'react';
import { ConfirmModal } from '../../../../components';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({
    services,
    onClickEditButton,
    onClickDeleteButton,
}: any) => {
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [openInputModal, setOpenInputModal] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<number | null>();

    const cancelConfirmModal = () => {
        setDeletedId(null);
        setOpenConfirmModal(false);
    };
    const navigate = useNavigate();
    return (
        <>
            <Row gutter={[24, 24]} className="cards">
                {services?.map((service: MedicalPackage) => {
                    return (
                        <Col
                            span={6}
                            className="card-item "
                            key={service?.name}
                        >
                            <div className="card-container flex-grow-1 border border-1  p-3  rounded border border-1 h-100 d-flex flex-column ">
                                <div className="service-image">
                                    <Image
                                        preview={false}
                                        src={service.image}
                                        className="rounded"
                                    ></Image>
                                </div>
                                <div className="card-body">
                                    <h6 className="doctor-name text-center mt-1">
                                        {service.name}
                                    </h6>
                                    <p className="mb-0 opacity-75 text-center mb-3">
                                        {service.categoryName}
                                    </p>
                                    <div className="clinic-info p-2 rounded mt-3">
                                        <p className="mb-1">
                                            <DollarOutlined className="me-1" />{' '}
                                            Giá:{' '}
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
                                <Flex className="group-button justify-content-between mt-3">
                                    <Button
                                        className="border-0 text-success"
                                        onClick={() => {
                                            onClickEditButton(service);
                                            const queryParams =
                                                new URLSearchParams();

                                            queryParams.append(
                                                'package',
                                                service.id.toString()
                                            );
                                            navigate(
                                                `/admin/service?${queryParams}`
                                            );
                                        }}
                                    >
                                        <EditOutlined /> Sửa
                                    </Button>
                                    <Button
                                        className="border-0 text-danger"
                                        onClick={() =>
                                            onClickDeleteButton(service)
                                        }
                                    >
                                        <DeleteOutlined /> Xóa
                                    </Button>
                                </Flex>
                            </div>
                        </Col>
                    );
                })}
            </Row>
            {/* {openConfirmModal && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa gói khám này"
                    // openModal={openConfirmModal}
                    handleCancelModal={cancelConfirmModal}
                    handleOk={DeleteService}
                />
            )} */}
        </>
    );
};
export default ServiceCard;
