import { useState, useEffect } from 'react';
import { Button, Modal, Form, Image, Input, Radio, Select } from 'antd';
import { baseURL } from '../../../constants/api';
import { EnvironmentOutlined } from '@ant-design/icons';
const { TextArea } = Input;
export const ModalOrderAppointment = ({
    isModalOpen,
    doctor,
    setIsModalOpen,
}: any): JSX.Element => {
    const handleOk = () => {
        console.log(doctor);
    };
    const [paymentMethod, setPaymentMethod] = useState(1);

    const handleOnChangeRadioPaymentMethod = (e: any) => {
        setPaymentMethod(Number(e.target.value));
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Modal
            onCancel={handleCancel}
            title={
                <h3 className="fs-5 text-capitalize border border-top-0 border-start-0 border-end-0 pb-2">
                    Phiếu đặt lịch khám
                </h3>
            }
            width={800}
            open={isModalOpen}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                    Đặt lịch
                </Button>,
                <Button key="back" onClick={handleCancel}>
                    Đóng
                </Button>,
            ]}
        >
            <div className="row">
                <div className="col-3 modal__left border border-top-0 border-start-0 border-bottom-0 ">
                    <h6 className="heading mb-4">Thông tin bác sĩ</h6>
                    <div className="doctor__info text-center">
                        <Image
                            preview={false}
                            src={baseURL + doctor.image}
                            className="rounded-circle"
                            width={115}
                        ></Image>
                        <h6 className="doctor__name mt-3">
                            {doctor.full_name}
                        </h6>
                    </div>
                    <div className="appointment__time mt-3">
                        <p className="time">
                            <strong>Thời gian:</strong> 16:00 - 17:00
                        </p>
                        <p className="date">
                            <strong>Ngày khám:</strong> 2024/10/02
                        </p>
                    </div>
                    <div className="location mt-3">
                        <span>
                            {' '}
                            <strong>Địa điểm:</strong> Hà Nội
                        </span>
                    </div>
                    <div className="fee mt-3">
                        <span>
                            <strong>Phí khám:</strong> 900.000 đ
                        </span>
                    </div>
                </div>
                <div className="col-9">
                    <Form>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_name"
                                className="form-label fw-bold fw-bold"
                            >
                                Tên bệnh nhân
                            </label>
                            <Input
                                className="form-control patient_name fw-bold"
                                id="patient_name"
                            ></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Giới tính
                            </label>
                            <Radio.Group className="d-block">
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                                <Radio value={3}>Khác</Radio>
                            </Radio.Group>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_phone"
                                className="form-label fw-bold"
                            >
                                Số điện thoại
                            </label>
                            <Input
                                className="fw-bold form-control patient_phone"
                                id="patient_phone"
                            ></Input>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_email"
                                className="form-label fw-bold"
                            >
                                Email
                            </label>
                            <Input
                                className="form-control patient_email"
                                id="patient_email"
                            ></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Ngày/ Tháng/ Năm Sinh
                            </label>
                            <Input
                                className=" form-control patient_phone"
                                id="patient_phone"
                                type="date"
                            ></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Tỉnh/ Thành phố
                            </label>
                            <Select
                                className="d-block"
                                showSearch
                                placeholder="Select a person"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={[
                                    { value: '1', label: 'Jack' },
                                    { value: '2', label: 'Lucy' },
                                    { value: '3', label: 'Tom' },
                                ]}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Quận/ Huyện
                            </label>
                            <Select
                                showSearch
                                className="d-block"
                                placeholder="Select a person"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={[
                                    { value: '1', label: 'Jack' },
                                    { value: '2', label: 'Lucy' },
                                    { value: '3', label: 'Tom' },
                                ]}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Xã/ Phường
                            </label>
                            <Select
                                showSearch
                                className="d-block"
                                placeholder="Select a person"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={[
                                    { value: '1', label: 'Jack' },
                                    { value: '2', label: 'Lucy' },
                                    { value: '3', label: 'Tom' },
                                ]}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Tổ/ Khu/ Thôn/ Xóm
                            </label>
                            <Input
                                className="form-control patient_email"
                                id="patient_"
                            ></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Lý do khám
                            </label>
                            <TextArea className="form-control"></TextArea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Hình thức thanh toán
                            </label>
                            <Radio.Group
                                className="d-block"
                                onChange={handleOnChangeRadioPaymentMethod}
                                value={paymentMethod}
                            >
                                <Radio value={1}>
                                    Thanh toán sau tại cơ sở y tế
                                </Radio>
                            </Radio.Group>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
