import { Modal, Col, Row, Divider, Button, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchInvoiceById } from '../hooks/invoice/useInvoice';

const ViewInvoiceModal = ({
    openViewInvoiceModal,
    cancelViewInvoiceModal,
}: any) => {
    const [searchParams] = useSearchParams();

    const {
        data: invoice,
        isError,
        isFetching,
    } = useFetchInvoiceById(
        searchParams.get('invoice') ? Number(searchParams.get('invoice')) : null
    );
    const [services, setServices] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);

    useEffect(() => {
        if (invoice) {
            const serviceNames = invoice?.serviceNames.split(',');
            setServices(serviceNames);
            const prices = invoice?.prices
                .split(',')
                .map((price: string) => Number(price));
            setPrices(prices);
        }
    }, [invoice]);

    return (
        <Modal
            open={openViewInvoiceModal}
            onCancel={cancelViewInvoiceModal}
            title="Chi tiết hóa đơn"
            className="w-50"
            footer={[
                <Button>Download PDF</Button>,
                <Button onClick={cancelViewInvoiceModal}>Đóng</Button>,
            ]}
        >
            <Skeleton active loading={isFetching}>
                {isError ? (
                    <p>{'Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!'}</p>
                ) : (
                    <div id="invoice-content">
                        <Row gutter={24}>
                            <Col span={12}>
                                <h1 className="fw-bold text-primary">
                                    SDOCTOR
                                </h1>
                            </Col>
                            <Col span={12} className="invoice-id">
                                <p className="text-end">
                                    <strong>Mã hóa đơn:</strong>{' '}
                                    <span className="text-primary fw-bold">
                                        #IV{invoice?.id}
                                    </span>
                                </p>
                                <p className="text-end">
                                    <strong>Ngày tạo:</strong>{' '}
                                    {dayjs(
                                        invoice?.createdAt?.split('Z')[0]
                                    ).format('DD-MM-YYYY HH:mm:ss')}
                                </p>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} className="mb-2">
                                <strong>Họ và tên:</strong>{' '}
                                {invoice?.patientName}
                            </Col>
                            <Col span={12} className="text-end">
                                <strong>Khám ngày:</strong>{' '}
                                {dayjs(
                                    invoice?.appointmentDate?.split('Z')[0]
                                ).format('DD-MM-YYYY')}
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} className="mb-2">
                                <strong>Thời gian khám:</strong>{' '}
                                {invoice?.startTime + ' - ' + invoice?.endTime}
                            </Col>
                            <Col span={12} className="mb-2 text-end">
                                <strong>Tổng thanh toán:</strong>{' '}
                                {invoice?.amount?.toLocaleString()} VNĐ
                            </Col>
                        </Row>
                        <Row className="mb-2" gutter={24}>
                            <Col span={12}>
                                <strong>Phương thức thanh toán:</strong>{' '}
                                {invoice?.paymentName}
                            </Col>
                            <Col span={12} className="text-end">
                                <strong>Trạng thái:</strong> {invoice?.status}
                            </Col>
                        </Row>
                        <div className="description mt-3">
                            <Row gutter={24}>
                                <Col span={24} className="header">
                                    <Row
                                        gutter={24}
                                        className="bg-light pt-2 pb-2"
                                    >
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
                                        {services.map((service, index) => (
                                            <Col
                                                span={24}
                                                key={index}
                                                className="mb-2"
                                            >
                                                <Row
                                                    gutter={24}
                                                    className="bg-light pt-2 pb-2"
                                                >
                                                    <Col
                                                        span={8}
                                                        className=" text-center"
                                                    >
                                                        {service}
                                                    </Col>
                                                    <Col
                                                        span={8}
                                                        className=" text-center"
                                                    >
                                                        1
                                                    </Col>
                                                    <Col
                                                        span={8}
                                                        className=" text-center"
                                                    >
                                                        {prices[
                                                            index
                                                        ].toLocaleString()}
                                                        VNĐ
                                                    </Col>
                                                </Row>
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </Skeleton>
        </Modal>
    );
};
export default ViewInvoiceModal;
