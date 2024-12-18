import { Modal, Col, Row, Divider, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Appointment } from '../models/appointment';
import { AppointmentService } from '../services/appointmentService';
// import downloadInvoicePdf from '../../../../utils/dowloadPDF';
import { useRef } from 'react';

const ViewInvoiceModal = ({
    openViewInvoiceModal,
    invoice,
    cancelViewInvoiceModal,
}: any) => {
    const [appointment, setAppointment] = useState<Appointment>(
        {} as Appointment
    );
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [createdInvoiceDate, setCreatedInvoiceDate] = useState<string>('');
    const getAppointmentById = async () => {
        try {
            const res = await AppointmentService.getAppointmentById(
                invoice?.appointment_id
            );

            console.log('invoice', invoice);
            console.log(res);
            setAppointment(res);
            const convertedAppointmentDate = new Date(
                res?.appointment_date.split('Z')[0]
            );
            const formattedAppointmentDate = `${convertedAppointmentDate.getDate()}-${
                convertedAppointmentDate.getMonth() + 1
            }-${convertedAppointmentDate.getFullYear()}`;
            const convertedCreatedDate = new Date(
                res?.created_at.split('Z')[0]
            );
            const formattedCreatedDate = `${convertedCreatedDate.getDate()}-${
                convertedCreatedDate.getMonth() + 1
            }-${convertedCreatedDate.getFullYear()} ${convertedCreatedDate.getHours()}:${convertedCreatedDate.getMinutes()}:${convertedCreatedDate.getSeconds()}`;
            setAppointmentDate(formattedAppointmentDate);
            setCreatedInvoiceDate(formattedCreatedDate);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getAppointmentById();
    }, []);
    const ref = useRef<HTMLDivElement>(null);
    const generatePdf = () => {
        if (ref.current) {
            console.log('gendr');
            // ReactToPdf(ref, { filename: 'document.pdf' });
        }
    };
    return (
        <Modal
            open={openViewInvoiceModal}
            onCancel={cancelViewInvoiceModal}
            title="Chi tiết hóa đơn"
            className="w-50"
            footer={[
                <Button onClick={generatePdf}>Download PDF</Button>,
                <Button onClick={cancelViewInvoiceModal}>Đóng</Button>,
            ]}
        >
            <div id="invoice-content" ref={ref}>
                <Row gutter={24}>
                    <Col span={12}>
                        <h1 className="fw-bold text-primary">SDOCTOR</h1>
                    </Col>
                    <Col span={12} className="invoice-id">
                        <p className="text-end">
                            <strong>Mã hóa đơn:</strong> {invoice?.id}
                        </p>
                        <p className="text-end">
                            <strong>Ngày tạo:</strong> {createdInvoiceDate}
                        </p>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12} className="mb-2">
                        <strong>Họ và tên:</strong> {invoice?.patient_name}
                    </Col>
                    <Col span={12} className="text-end">
                        <strong>Khám ngày:</strong> {appointmentDate}
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12} className="mb-2">
                        <strong>Thời gian khám:</strong>{' '}
                        {appointment?.time_value}
                    </Col>
                    <Col span={12} className="mb-2 text-end">
                        <strong>Tổng thanh toán:</strong>{' '}
                        {invoice?.amount?.toLocaleString()} VNĐ
                    </Col>
                </Row>
                <Row className="mb-2" gutter={24}>
                    <Col span={12}>
                        <strong>Phương thức thanh toán:</strong>{' '}
                        {invoice?.payment_name}
                    </Col>
                    <Col span={12} className="text-end">
                        <strong>Trạng thái:</strong> {invoice?.status}
                    </Col>
                </Row>
                <div className="description mt-3">
                    <Row gutter={24}>
                        <Col span={24} className="header">
                            <Row gutter={24} className="bg-light pt-2 pb-2">
                                <Col
                                    span={8}
                                    className="fw-bold fs-6 text-center"
                                >
                                    Dịch vụ
                                </Col>
                                <Col
                                    span={8}
                                    className="fw-bold fs-6 text-center"
                                >
                                    Số lượng
                                </Col>
                                <Col
                                    span={8}
                                    className="fw-bold fs-6 text-center"
                                >
                                    Giá
                                </Col>
                            </Row>
                            <Divider className="mt-2 mb-2" />
                            <Row gutter={24} className="">
                                <Col span={8} className=" text-center">
                                    {appointment?.service_name}
                                </Col>
                                <Col span={8} className=" text-center">
                                    1
                                </Col>
                                <Col span={8} className=" text-center">
                                    {appointment?.price?.toLocaleString()} VNĐ
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
export default ViewInvoiceModal;
