import { Button, Card, Col, Form, Input, List, Modal, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { PatientProfile } from '../../../../models';
import { useFetchProfiles } from '../../../../hooks';
import '@/assets/scss/profile_selection_modal.scss';

import {
    ArrowRightOutlined,
    EditOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
interface ProfileSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectProfile: (profile: PatientProfile) => void;
}
const ProfileSelectionModal = ({
    visible,
    onClose,
    onSelectProfile,
}: ProfileSelectionModalProps) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfile, setEditingProfile] = useState<PatientProfile | null>(
        null
    );
    const {
        data: profiles,
        isError,
        error,
        isFetching,
    } = useFetchProfiles(JSON.parse(localStorage.getItem('uuids') || `[]`));
    useEffect(() => {
        console.log('profiles', profiles);
    }, [profiles]);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    return (
        <Modal
            className="w-75"
            title="Chọn hoặc thêm hồ sơ bệnh nhân"
            open={visible}
            onCancel={onClose}
            footer={[
                <div className="d-flex justify-content-between">
                    <Button type="primary">Thêm mới</Button>
                    <Button onClick={onClose}>Đóng </Button>
                </div>,
            ]}
        >
            {isError ? (
                <p className="fw-bold text-center">
                    {error.message.includes('404')
                        ? 'Không có hồ sơ nào !'
                        : error.message}
                </p>
            ) : (
                <List
                    itemLayout="vertical"
                    grid={
                        profiles?.length === 1
                            ? { gutter: 24, column: 1 } // 1 cột khi chỉ có 1 profile
                            : { gutter: 24, column: 2 } // 2 cột khi có 2+ profiles}
                    }
                    dataSource={profiles}
                    renderItem={(profile: PatientProfile) => {
                        return (
                            <List.Item actions={[]}>
                                <Card
                                    className={
                                        profiles?.length === 1
                                            ? 'shadow w-50 m-auto '
                                            : 'shadow '
                                    }
                                >
                                    <Row gutter={24} className="">
                                        <Col span={24}>
                                            <Col span={24}>
                                                <UserOutlined className="fs-6 text-body-tertiary" />
                                                <span
                                                    className="ms-2 fs-6 fw-medium"
                                                    style={{ color: '#0378db' }}
                                                >
                                                    {profile.patientName}
                                                </span>
                                            </Col>
                                            <Col span={24} className="d-flex">
                                                <div className="col-5">
                                                    <label className="fs-6">
                                                        <i className="fs-6  fa-solid fa-cake-candles d-inline-block  text-body-tertiary"></i>
                                                        <span className="ms-2 fs-6 fw-medium">
                                                            Ngày sinh :
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="col-7">
                                                    <span className="col-6 fs-6 fw-medium">
                                                        {dayjs(
                                                            profile.birthday
                                                        ).format('DD/MM/YYYY')}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col span={24} className="d-flex">
                                                <div className="col-5">
                                                    <label className="fs-6">
                                                        <PhoneOutlined className="text-body-tertiary" />
                                                        <span className="ms-2 fs-6 fw-medium">
                                                            Số điện thoại :
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="col-7">
                                                    <span className="col-6 fs-6 fw-medium">
                                                        {profile.patientPhone}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col span={24} className="d-flex">
                                                <div className="col-5">
                                                    <label className="fs-6">
                                                        <EnvironmentOutlined className="text-body-tertiary" />
                                                        <span className="ms-2 fs-6 fw-medium">
                                                            Địa chỉ :
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="col-7">
                                                    <span className="col-6 fs-6 fw-medium">
                                                        {profile.commune +
                                                            ',' +
                                                            profile.district +
                                                            ',' +
                                                            profile.province}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col span={24} className="d-flex">
                                                <div className="col-5">
                                                    <label className="fs-6">
                                                        <i className="fa-regular fa-envelope  text-body-tertiary"></i>
                                                        <span className="ms-2 fs-6 fw-medium">
                                                            Địa chỉ email :
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="col-7">
                                                    <span className="col-6 fs-6 fw-medium">
                                                        {profile.patientEmail}
                                                    </span>
                                                </div>
                                            </Col>
                                        </Col>
                                        <Col span={24} className="mt-3">
                                            <Row
                                                gutter={24}
                                                justify={'space-between'}
                                            >
                                                <Col
                                                    span={12}
                                                    className="d-flex"
                                                >
                                                    <Button
                                                        style={{
                                                            backgroundColor:
                                                                'rgba(54,153,255,.1)',
                                                        }}
                                                        className="ms-3 border-0"
                                                        onClick={() => {
                                                            const queryParams =
                                                                new URLSearchParams();
                                                            queryParams.append(
                                                                'profile',
                                                                profile.uuid.toString()
                                                            );

                                                            queryParams.append(
                                                                'index',
                                                                searchParams.get(
                                                                    'doctorId'
                                                                ) ?? ''
                                                            );
                                                            navigate(
                                                                `/patient/profile?${queryParams.toString()}`
                                                            );
                                                            onClose();
                                                        }}
                                                    >
                                                        <EditOutlined /> Chỉnh
                                                        sửa
                                                    </Button>
                                                </Col>
                                                <Col
                                                    span={12}
                                                    className="text-end"
                                                >
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor:
                                                                'rgb(29, 161, 242)',
                                                        }}
                                                        onClick={() =>
                                                            onSelectProfile(
                                                                profile
                                                            )
                                                        }
                                                    >
                                                        Tiếp tục{' '}
                                                        <ArrowRightOutlined />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        );
                    }}
                ></List>
            )}
        </Modal>
    );
};

export default ProfileSelectionModal;
