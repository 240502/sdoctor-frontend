import { Modal, Button, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { DoctorServiceService } from '../../../../services/doctorServiceService';
import { DoctorService } from '../../../../models/doctorService';
import dayjs from 'dayjs';
import { invoicesService } from '../../../../services/invoicesService';

export const InvoiceModal = ({
    invoice,
    openInvoiceModal,
    cancelInvoiceModal,
    setInvoice,
    getInvoices,
    openNotification,
}: any) => {
    const [form] = Form.useForm();
    const [doctorServices, setDoctorServices] = useState<DoctorService[]>([]);

    const onFinish = (values: any) => {
        console.log(values);
        const dataUpdate = {
            id: invoice?.id,
            service_id: values.service_id,
            amount: values.amount,
            status: values.status,
            payment_method: values.payment_method,
        };
        UpdateInvoice(dataUpdate);
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

    const getAllDoctorService = async () => {
        try {
            const res = await DoctorServiceService.getAll();
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
                    <Col span={12}>
                        <Form.Item label="Ngày khám" name={'appointment_date'}>
                            <DatePicker
                                className="w-100 pe-none"
                                format={'DD-MM-YYYY'}
                            ></DatePicker>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giờ khám" name={'time_value'}>
                            <Input className="d-block" readOnly={true}></Input>
                        </Form.Item>
                    </Col>
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
                            <Input readOnly={true}></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Ngày tạo" name={'created_at'}>
                            <DatePicker
                                className="w-100 pe-none"
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
                                    className="w-100 pe-none"
                                    showTime
                                    onChange={(value, dateString) => {
                                        console.log('Selected Time: ', value);
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
                    <Col span={12}>
                        <Form.Item
                            name={'payment_method'}
                            key={'payment_method'}
                            label={'Phương thức thanh toán'}
                        >
                            <Select>
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
