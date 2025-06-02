import { Button, Typography, Space, Card, Skeleton, Modal } from 'antd';
import { useFetchAppointmentById } from '../hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
const { Title, Text } = Typography;
import Barcode from 'react-barcode';
import { useEffect } from 'react';
import { useCreateVnpay } from '../hooks/payment/useCreateVnpay';
const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const { data, isError, error, isFetching } = useFetchAppointmentById(
        Number(searchParams.get('appointment'))
    );
    const { mutate: createPayment } = useCreateVnpay();
    useEffect(() => {
        if (
            data?.paymentMethod === 2 &&
            data?.invoiceStatus === 'Chưa thanh toán'
        ) {
            Modal.warning({
                closable: true,
                title: 'Vui lòng thanh toán trước thời gian hẹn 1 tiếng!',
                content: (
                    <>
                        <p className="mt-2">
                            Lịch hẹn của bạn với bác sĩ{' '}
                            {data.doctorName || 'N/A'} vào {data.startTime} -{' '}
                            {dayjs(data.appointmentDate).format('DD-MM-YYYY')}{' '}
                            chưa được thanh toán. Vui lòng hoàn tất thanh toán
                            để xác nhận lịch hẹn.
                        </p>
                        <p className="mt-2">
                            Số tiền cần thanh toán:{' '}
                            <strong>
                                {data.amount.toLocaleString('vi-VN')} VNĐ
                            </strong>
                        </p>
                    </>
                ),
                okText: 'Thanh toán ngay',
                cancelText: 'Đóng',
                onOk: () => {
                    if (data?.id) {
                        createPayment(data.id);
                    }
                },
            });
        }
    }, [data]);
    const navigate = useNavigate();
    return (
        <div className="container my-4">
            {isError ? (
                <p className="fw-bold text-center">
                    {'Có lỗi khi tải dữ liệu vui lòng thử lại sau !'}
                </p>
            ) : (
                <Skeleton active loading={isFetching}>
                    <Card
                        className=" shadow p-3 mx-auto"
                        style={{ maxWidth: '400px' }}
                    >
                        <Title level={4} className="text-center mb-0">
                            Phiếu Khám Bệnh
                        </Title>
                        <Text strong className="d-block text-center">
                            {data?.clinicName}
                        </Text>
                        <Text
                            type="secondary"
                            className="d-block text-center mb-3"
                        >
                            {data?.location}
                        </Text>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <p className="fw-bold text-center mb-2">
                                    Mã phiếu
                                </p>
                                <div>
                                    {data?.id && (
                                        <Barcode
                                            value={'#Apt' + data?.id.toString()}
                                            height={40}
                                            width={1}
                                            margin={0}
                                            displayValue={false} // Ẩn giá trị text bên dưới mã vạch
                                        />
                                    )}
                                </div>
                                <p className="text-center fs-6 fw-bold mb-0">
                                    {'#Apt' + data?.id}
                                </p>
                            </div>
                            <div className="border border-primary rounded px-2 py-1 mt-1 text-center">
                                <p className="mb-2"> Giờ khám dự kiến:</p>
                                <span className="fw-bold">
                                    {data?.startTime + '-' + data?.endTime}
                                </span>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="text-center mb-3">
                            <Button
                                type="primary"
                                shape="round"
                                style={{
                                    backgroundColor: '#f5a623',
                                    borderColor: '#f5a623',
                                }}
                            >
                                Đặt Khám Thành Công
                            </Button>
                        </div>

                        {/* Cost */}
                        <Text className="d-block text-center mb-1">
                            {data?.paymentMethod === 1
                                ? ' Chi phí:'
                                : 'Chi phí: '}{' '}
                            <Text strong>
                                {data?.amount.toLocaleString(undefined)} VNĐ
                            </Text>
                        </Text>
                        <Text
                            type="secondary"
                            className="d-block text-center mb-3"
                        >
                            (Đã bao gồm phí khám + phí tiện ích)
                        </Text>

                        {/* Details */}
                        <Space direction="vertical" size={4} className="w-100">
                            <div>
                                <Text strong>Mã phiếu: </Text>
                                <Text>{'#Apt' + data?.id}</Text>
                            </div>
                            <div>
                                <Text strong>Bác sĩ: </Text>
                                <Text>{data?.doctorName}</Text>
                            </div>
                            <div>
                                <Text strong>Dịch vụ: </Text>
                                <Text>{data?.serviceName}</Text>
                            </div>
                            {/* <div>
                        <Text strong>Hình thức khám: </Text>
                        <Text>Không có BHYT</Text>
                    </div> */}
                            <div>
                                <Text strong>Thời gian khám: </Text>
                                <Text>
                                    {data?.startTime + '-' + data?.endTime} -
                                    8/5/2025
                                </Text>
                            </div>
                            <div>
                                <Text strong>Phí khám: </Text>
                                <Text>
                                    {data?.amount.toLocaleString(undefined)} VNĐ
                                </Text>
                            </div>
                            <div>
                                <Text strong>Bệnh nhân: </Text>
                                <Text>{data?.patientName}</Text>
                            </div>
                            <div>
                                <Text strong>Ngày sinh: </Text>
                                <Text>
                                    {dayjs(data?.birthday).format('DD-MM-YYYY')}
                                </Text>
                            </div>
                            <div>
                                <Text strong>Mã bệnh nhân: </Text>
                                <Text>{data?.uuid}</Text>
                            </div>
                        </Space>
                    </Card>
                    <div className="text-center mt-3">
                        <Button
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Trang chủ
                        </Button>
                    </div>
                </Skeleton>
            )}
        </div>
    );
};
export default BookingSuccess;
