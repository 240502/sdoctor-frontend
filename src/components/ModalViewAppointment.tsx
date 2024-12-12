import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../models/doctor';
import { Image } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

const ModalViewAppointment = ({
    handleCancelModal,
    isModalOpen,
    appointment,
}: any) => {
    const dateFormat = 'YYYY-MM-DD';
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const getDoctorById = async (id: number) => {
        try {
            const res = await doctorService.getDoctorById(id);
            console.log(res);
            setDoctor(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getDoctorById(appointment.doctor_id);
    }, [appointment]);

    return (
        <Modal
            title={
                <h3 className="fs-5 text-capitalize border border-top-0 border-start-0 border-end-0 pb-2">
                    Phiếu đặt lịch khám
                </h3>
            }
            onCancel={handleCancelModal}
            open={isModalOpen}
            width={800}
            maskClosable={false}
            footer={[
                <Button
                    key="back"
                    onClick={() => {
                        handleCancelModal();
                    }}
                >
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
                            src={doctor.image}
                            className="rounded-circle"
                            width={115}
                        ></Image>
                        <h6 className="doctor__name mt-3">
                            {doctor.full_name}
                        </h6>
                    </div>
                    <div className="appointment__time mt-3">
                        <p className="time">
                            <strong>Thời gian:</strong> {appointment.time_value}
                        </p>
                        <p className="date">
                            <strong>Ngày khám:</strong>{' '}
                            {appointment.appointment_date
                                .toString()
                                .slice(0, 10)}
                        </p>
                    </div>
                    <div className="location mt-3">
                        <span>
                            {' '}
                            <strong>Địa điểm:</strong> {doctor.address}
                        </span>
                    </div>
                    <div className="fee mt-3">
                        <span>
                            <strong>Phí khám:</strong>{' '}
                            {appointment.price.toLocaleString(undefined)} đ
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
                                className="form-control patient_name "
                                id="patient_name"
                                value={appointment.patient_name}
                            ></Input>

                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Giới tính
                            </label>
                            <Radio.Group
                                value={Number(appointment.gender)}
                                className="d-block"
                            >
                                <Radio value={1}>Nam</Radio>
                                <Radio value={2}>Nữ</Radio>
                                <Radio value={3}>Khác</Radio>
                            </Radio.Group>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_phone"
                                className="form-label fw-bold"
                            >
                                Số điện thoại
                            </label>
                            <Input
                                value={appointment.patient_phone}
                                className=" form-control patient_phone"
                                id="patient_phone"
                            ></Input>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="patient_email"
                                className="form-label fw-bold"
                            >
                                Email
                            </label>
                            <Input
                                value={appointment.patient_email}
                                className="form-control patient_email"
                                id="patient_email"
                            ></Input>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Ngày/ Tháng/ Năm Sinh
                            </label>
                            <DatePicker
                                defaultValue={dayjs(
                                    appointment.birthday,
                                    dateFormat
                                )}
                                className="d-block"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Tỉnh/ Thành phố
                            </label>

                            <Input value={appointment.province}></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Quận/ Huyện
                            </label>
                            <Input value={appointment.district}></Input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Xã/ Phường
                            </label>

                            <Input value={appointment.commune}></Input>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Lý do khám
                            </label>
                            <TextArea
                                value={appointment.examination_reason}
                                className="form-control"
                            ></TextArea>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="" className="form-label fw-bold">
                                Hình thức thanh toán
                            </label>
                            <Radio.Group className="d-block" value={1}>
                                <Radio value={1}>
                                    Thanh toán sau tại cơ sở y tế
                                </Radio>
                            </Radio.Group>
                            <div
                                className="error_message mt-3"
                                style={{ color: 'red' }}
                            ></div>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default ModalViewAppointment;
