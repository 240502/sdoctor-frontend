import { Modal, Button, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { DoctorService } from '../../../../models/doctor_service';
import dayjs from 'dayjs';
import {
    invoicesService,
    appointmentService,
    doctorServiceService,
} from '../../../../services';
import { useFetchAppointmentAtInvoice } from '../../../../hooks';

export const InvoiceModal = ({
    invoice,
    openInvoiceModal,
    cancelInvoiceModal,
    setInvoice,
    getInvoices,
    openNotification,
    update,
}: any) => {
    const [form] = Form.useForm();
    const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);
    const [invoiceType, setInvoiceType] = useState<number>(1);
    const onFinish = (values: any) => {
        console.log(values);
        const dataUpdate = {
            id: invoice?.id,
            service_id: values.service_id,
            amount: values.amount,
            status: values.status,
            payment_method: values.payment_method,
        };
        if (update) {
            UpdateInvoice(dataUpdate);
        } else {
            if (invoiceType === 1) {
                const newInvoice = {
                    appointment_id: null,
                    doctor_id: null,
                    service_id: form.getFieldValue('service_id'),
                    amount: form.getFieldValue('amount'),
                    payment_method: form.getFieldValue('payment_method'),
                    patient_name: form.getFieldValue('patient_name'),
                    patient_phone: form.getFieldValue('patient_phone'),
                };
                CreateInvoice(newInvoice);
            } else {
                const data = {
                    patientName: values.patient_name,
                    doctorName: values.doctor_name,
                    patientPhone: values.patient_phone,
                    appointmentDate: dayjs(values.appointment_date).format(),
                };

                getAppointment(data);
            }
        }
    };
    // const { data: appointment } = useFetchAppointmentAtInvoice();
    const getAppointment = async (data: any) => {
        try {
            const res = await appointmentService.getAppointmentAtInvoice(data);
            console.log(res);
            const newInvoice = {
                appointment_id: res?.id,
                doctor_id: res?.doctor_id,
                service_id: form.getFieldValue('service_id'),
                amount: form.getFieldValue('amount'),
                payment_method: form.getFieldValue('payment_method'),
                patient_name: form.getFieldValue('patient_name'),
                patient_phone: form.getFieldValue('patient_phone'),
            };
            CreateInvoice(newInvoice);
            console.log(newInvoice);
        } catch (err: any) {
            console.log(err);
        }
    };
    const UpdateInvoice = async (data: any) => {
        try {
            const res = await invoicesService.updateInvoice(data);
            console.log(res);
            openNotification('success', 'Thông báo', 'Cập nhập thành công!');

            getInvoices();
            cancelInvoiceModal();
        } catch (err: any) {
            openNotification(
                'error',
                'Thông báo',
                'Cập nhập không thành công!'
            );

            console.log(err.message);
        }
    };
    const CreateInvoice = async (data: any) => {
        try {
            const res = await invoicesService.createInvoice(data);
            openNotification(
                'success',
                'Thông báo',
                'Thêm hóa đơn thành công!'
            );
            console.log(res);
            //cancelInvoiceModal();
        } catch (err: any) {
            openNotification(
                'success',
                'Thông báo',
                'Thêm hóa đơn không thành công!'
            );

            console.log(err.message);
        }
    };

    const getAllDoctorService = async () => {
        try {
            const res = await doctorServiceService.getAll();
            setDoctorServices(res);
        } catch (err: any) {}
    };
    useEffect(() => {
        console.log('invoice', invoice);
        getAllDoctorService();
    }, []);
    useEffect(() => {
        console.log('invoice', invoice);
    }, [invoice]);
    return (
        <Modal
            className="w-50"
            title="Chi tiết hóa đơn"
            open={openInvoiceModal}
            onCancel={cancelInvoiceModal}
            footer={[
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => form.submit()}
                >
                    Lưu
                </Button>,
                <Button onClick={cancelInvoiceModal}>Đóng</Button>,
            ]}
        >
            <Row className="invoice-type mb-3 mt-3" gutter={24}>
                <Col span={10}>
                    <label htmlFor="" className="mb-2">
                        Loại hóa đơn
                    </label>
                    <Select
                        className="w-100"
                        value={invoiceType}
                        onChange={(value: number) => setInvoiceType(value)}
                    >
                        <Select.Option value={0}>
                            Bệnh nhân đặt lịch trước
                        </Select.Option>
                        <Select.Option value={1}>
                            Bệnh nhân không hẹn trước
                        </Select.Option>
                    </Select>
                </Col>
            </Row>
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
                initialValues={{
                    ...invoice,
                    created_at: invoice?.created_at
                        ? dayjs(invoice?.created_at.toString().split('Z')[0])
                        : null,
                    payment_date: invoice?.payment_date
                        ? dayjs(invoice?.payment_date.toString().split('Z')[0])
                        : null,
                    appointment_date: invoice?.appointment_date
                        ? dayjs(
                              invoice?.appointment_date.toString().split('Z')[0]
                          )
                        : null,
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Bệnh nhân"
                            name={'patient_name'}
                            className="d-block"
                        >
                            <Input className="d-block"></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Bác sĩ kiểm tra" name={'doctor_name'}>
                            <Input className="d-block"></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    {!update && (
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại bệnh nhân"
                                name={'patient_phone'}
                            >
                                <Input></Input>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <Form.Item label="Ngày khám" name={'appointment_date'}>
                            <DatePicker
                                className="w-100 pe-none"
                                format={'DD-MM-YYYY'}
                            ></DatePicker>
                        </Form.Item>
                    </Col>
                    {update && (
                        <Col span={12}>
                            <Form.Item label="Giờ khám" name={'time_value'}>
                                <Input
                                    className="d-block"
                                    readOnly={update}
                                ></Input>
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Dịch vụ"
                            name={'service_id'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ô này',
                                },
                            ]}
                        >
                            <Select
                                className="d-block "
                                onChange={(value: number) => {
                                    console.log('service value', value);
                                    const service = doctorServices.find(
                                        (doctorService: DoctorService) =>
                                            doctorService.id === value
                                    );
                                    setInvoice({
                                        ...invoice,
                                        service_id: value,
                                        amount: service?.price,
                                    });
                                    form.setFieldValue(
                                        'amount',
                                        service?.price
                                    );
                                }}
                            >
                                {doctorServices.map(
                                    (service: DoctorService) => {
                                        return (
                                            <Select.Option
                                                value={service.id}
                                                key={service.id}
                                            >
                                                {service.name}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name={'amount'}
                            key={'amount'}
                            label="Tổng tiền"
                        >
                            <Input readOnly={update}></Input>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    {update && (
                        <>
                            <Col span={12}>
                                <Form.Item label="Ngày tạo" name={'created_at'}>
                                    <DatePicker
                                        className={`w-100 ${
                                            update ? 'pe-none' : ''
                                        }`}
                                        showTime
                                        onChange={(value, dateString) => {}}
                                        // onOk={onOk}
                                        format={'DD-MM-YYYY HH:mm:ss'}
                                    />
                                </Form.Item>
                            </Col>
                            {invoice?.status === 'Đã thanh toán' && (
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày thanh toán"
                                        name={'payment_date'}
                                    >
                                        <DatePicker
                                            className={`w-100 ${
                                                update ? 'pe-none' : ''
                                            }`}
                                            showTime
                                            onChange={(value, dateString) => {
                                                console.log(
                                                    'Selected Time: ',
                                                    value
                                                );
                                                console.log(
                                                    'Formatted Selected Time: ',
                                                    dateString
                                                );
                                            }}
                                            format={'DD-MM-YYYY HH:mm:ss'}
                                            // onOk={onOk}
                                        />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col span={12}>
                                <Form.Item
                                    key={'status'}
                                    name={'status'}
                                    label="Trạng thái"
                                >
                                    <Select>
                                        <Select.Option
                                            value="Đã thanh toán"
                                            key={'Đã thanh toán'}
                                        >
                                            Đã thanh toán
                                        </Select.Option>
                                        <Select.Option
                                            value="Chưa thanh toán"
                                            key={'Chưa thanh toán'}
                                        >
                                            Chưa thanh toán
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>
                    )}

                    <Col span={12}>
                        <Form.Item
                            name={'payment_method'}
                            key={'payment_method'}
                            label={'Phương thức thanh toán'}
                        >
                            <Select
                                placeholder="Chọn phương thức thanh toán"
                                allowClear
                            >
                                <Select.Option value={1}>
                                    Thanh toán tại cơ sở y tế
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
