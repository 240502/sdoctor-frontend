import { Card, Typography, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { newAppointmentValue } from '../stores/appointmentAtom';
import { useEffect } from 'react';
import { invoiceValue } from '../stores/invoice';
const { Title, Text } = Typography;
import dayjs from 'dayjs';
import { useCreatePayment } from '../hooks';
import { useSearchParams } from 'react-router-dom';
const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const newAppointment = useRecoilValue(newAppointmentValue);
    const createPayment = useCreatePayment();
    const payment = Number(searchParams.get('payment'));
    const appointmentId = Number(searchParams.get('appointment'));

    useEffect(() => {}, []);
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f6f9fc',
            }}
        >
            <Card
                style={{
                    width: 400,
                    textAlign: 'center',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <CheckCircleOutlined
                    style={{ fontSize: '64px', color: '#52c41a' }}
                />
                <Title level={3} style={{ marginTop: '16px' }}>
                    Đặt lịch thành công!
                </Title>
                <Text>Bạn sẽ nhận được xác nhận chi tiết qua email..</Text>
                {payment === 2 && (
                    <p>
                        Bạn cần thanh toán hóa đơn phí khám trước
                        <br></br>
                        {dayjs(
                            newAppointment.createdAt.toString().split('Z')[0]
                        )
                            .add(60, 'minute')
                            .format('HH:mm:ss DD-MM-YYYY')}
                    </p>
                )}

                <Space style={{ marginTop: '24px' }}>
                    {payment === 2 && (
                        <Button
                            type="primary"
                            onClick={() => {
                                createPayment.mutate(appointmentId);
                            }}
                        >
                            Thanh toán
                        </Button>
                    )}
                    <Button onClick={() => navigate('/patient/appointment')}>
                        Xem chi tiết
                    </Button>
                </Space>
            </Card>
        </div>
    );
};
export default BookingSuccess;
