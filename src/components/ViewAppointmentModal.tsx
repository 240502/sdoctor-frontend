import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { PaymentMethod } from '../models';
import {
    Button,
    Col,
    Divider,
    Form,
    Image,
    InputNumber,
    Modal,
    Radio,
    Row,
    Select,
    Skeleton,
} from 'antd';

import dayjs from 'dayjs';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { DoctorService } from '../models/doctor_service';
import TextArea from 'antd/es/input/TextArea';
import { useFetchAppointmentById } from '../hooks';
const InputAppointmentModal = ({ openModal, cancelModal }: any) => {
    const [searchParams] = useSearchParams();

    const { data, isFetching } = useFetchAppointmentById(
        searchParams.get('appointment')
            ? Number(searchParams.get('appointment'))
            : null
    );
    useEffect(() => {
        console.log(data);
    }, [data]);
    const [form] = Form.useForm();

    return (
        <Modal
            title={
                <>
                    <h6>Phiếu đặt lịch khám</h6>
                    <Divider />
                </>
            }
            open={openModal}
            onCancel={cancelModal}
            maskClosable={false}
            footer={[]}
            className="w-50"
        >
            <Skeleton active loading={isFetching}>
                <Row gutter={24}>
                    <Col
                        span={8}
                        className="left appointment-info border border-start-0 border-top-0 border-bottom-0"
                    >
                        <h6 className="">Thông tin bác sĩ</h6>
                        <div className="doctor-info text-center">
                            <Image
                                src={''}
                                preview={false}
                                className="w-25 rounded-circle"
                            />
                            <h6 className="doctor-name w-full mt-3">
                                {data?.doctorName}
                            </h6>
                        </div>
                        <div className="time">
                            <p className="">
                                <strong>Thời gian: </strong> {data?.startTime} -{' '}
                                {data?.endTime}
                            </p>
                            <p>
                                <strong>Ngày khám: </strong>
                                {dayjs(data?.appointmentDate).format(
                                    'DD-MM-YYYY'
                                )}
                            </p>
                        </div>
                        <div className="location ">
                            <p>
                                {' '}
                                <strong>Địa điểm: </strong> {data?.location}
                            </p>
                        </div>
                    </Col>
                    <Col span={16}>
                        <h6>Thông tin bệnh nhân</h6>
                        <Row gutter={24} className="mb-3">
                            <Col span={24}>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label htmlFor="">
                                            <UserOutlined className="fs-6 text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Họ và tên :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientName.toUpperCase()}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <i className="fs-6  fa-solid fa-cake-candles d-inline-block  text-body-tertiary"></i>
                                            <span className="ms-2 fs-6 ">
                                                Ngày sinh :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {dayjs(data?.birthday).format(
                                                'DD/MM/YYYY'
                                            )}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <PhoneOutlined className="text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Số điện thoại :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientPhone}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <EnvironmentOutlined className="text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Địa chỉ :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6  fw-medium">
                                            {data?.commune +
                                                ',' +
                                                data?.district +
                                                ',' +
                                                data?.province}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <i className="fa-regular fa-envelope  text-body-tertiary"></i>
                                            <span className="ms-2 fs-6 ">
                                                Địa chỉ email :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientEmail}
                                        </span>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <h6>Dịch vụ</h6>
                        <Row gutter={24} className="mb-3">
                            <Col span={24}>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label htmlFor="">
                                            <UserOutlined className="fs-6 text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Họ và tên :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientName.toUpperCase()}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <i className="fs-6  fa-solid fa-cake-candles d-inline-block  text-body-tertiary"></i>
                                            <span className="ms-2 fs-6 ">
                                                Ngày sinh :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {dayjs(data?.birthday).format(
                                                'DD/MM/YYYY'
                                            )}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <PhoneOutlined className="text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Số điện thoại :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientPhone}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <EnvironmentOutlined className="text-body-tertiary" />
                                            <span className="ms-2 fs-6 ">
                                                Địa chỉ :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6  fw-medium">
                                            {data?.commune +
                                                ',' +
                                                data?.district +
                                                ',' +
                                                data?.province}
                                        </span>
                                    </div>
                                </Col>
                                <Col span={24} className="d-flex mb-2">
                                    <div className="col-5">
                                        <label className="fs-6">
                                            <i className="fa-regular fa-envelope  text-body-tertiary"></i>
                                            <span className="ms-2 fs-6 ">
                                                Địa chỉ email :
                                            </span>
                                        </label>
                                    </div>
                                    <div className="col-7">
                                        <span className="col-6 fs-6 fw-medium">
                                            {data?.patientEmail}
                                        </span>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Skeleton>
        </Modal>
    );
};

export default InputAppointmentModal;
