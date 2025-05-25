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
import { useDeleteMedicalPackage } from '../../../../hooks';
import { NoticeType } from 'antd/es/message/interface';

interface ServiceCardProps {
    medicalPackages?: MedicalPackage[];
    onClickEditButton: (medicalPackage: MedicalPackage) => void;
    openMessage: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
const ServiceCard = ({
    medicalPackages,
    onClickEditButton,
    openMessage,
    refetch,
}: ServiceCardProps) => {
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<number | null>(null);

    const cancelConfirmModal = () => {
        setDeletedId(null);
        setOpenConfirmModal(false);
    };
    const { mutate: deleteMedicalPackage } = useDeleteMedicalPackage();
    const navigate = useNavigate();
    const handleConfirm = () => {
        deleteMedicalPackage(deletedId, {
            onSuccess() {
                openMessage('success', 'Xóa thành công!');
                refetch();
            },
            onError() {
                openMessage('success', 'Xóa không thành công!');
            },
        });
    };
    return (
        <>
            <Row gutter={[24, 24]} className="cards">
                {medicalPackages?.map((medicalPackage: MedicalPackage) => {
                    return (
                        <Col
                            span={6}
                            className="card-item "
                            key={medicalPackage?.name}
                        >
                            <div className="card-container flex-grow-1 border border-1  p-3  rounded border border-1 h-100 d-flex flex-column ">
                                <div className="service-image">
                                    <Image
                                        preview={false}
                                        src={medicalPackage.image}
                                        className="rounded"
                                    ></Image>
                                </div>
                                <div className="card-body">
                                    <h6 className="doctor-name text-center mt-1">
                                        {medicalPackage.name}
                                    </h6>
                                    <p className="mb-0 opacity-75 text-center mb-3">
                                        {medicalPackage.categoryName}
                                    </p>
                                    <div className="clinic-info p-2 rounded mt-3">
                                        <p className="mb-1">
                                            <DollarOutlined className="me-1" />{' '}
                                            Giá:{' '}
                                            <span className="text-success fw-bold mb-1">
                                                {medicalPackage.price.toLocaleString(
                                                    undefined
                                                )}{' '}
                                                VNĐ
                                            </span>
                                        </p>
                                        <p className="mb-1">
                                            <i className="fa-regular fa-hospital me-1"></i>
                                            {medicalPackage.clinicName}
                                        </p>

                                        <p>
                                            <EnvironmentOutlined className="me-1" />{' '}
                                            {medicalPackage.location}
                                        </p>
                                    </div>
                                </div>
                                <Flex className="group-button justify-content-between mt-3">
                                    <Button
                                        className="border-0 text-success"
                                        onClick={() => {
                                            onClickEditButton(medicalPackage);
                                            const queryParams =
                                                new URLSearchParams();

                                            queryParams.append(
                                                'package',
                                                medicalPackage.id.toString()
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
                                        onClick={() => {
                                            setDeletedId(medicalPackage.id);
                                            setOpenConfirmModal(true);
                                        }}
                                    >
                                        <DeleteOutlined /> Xóa
                                    </Button>
                                </Flex>
                            </div>
                        </Col>
                    );
                })}
            </Row>
            {openConfirmModal && (
                <ConfirmModal
                    message="Bạn chắc chắn muốn xóa gói khám này"
                    isOpenModal={openConfirmModal}
                    onCloseModal={cancelConfirmModal}
                    handleOk={handleConfirm}
                />
            )}
        </>
    );
};
export default ServiceCard;
