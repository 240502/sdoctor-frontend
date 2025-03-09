import { Card, Typography, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { newAppointmentValue } from '../stores/appointmentAtom';
import { useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { invoiceValue } from '../stores/invoice';
import { Invoices } from '../models/invoices';
const { Title, Text } = Typography;
import dayjs from 'dayjs';
const BookingSuccess = () => {
    const navigate = useNavigate();
    const newAppointment = useRecoilValue(newAppointmentValue);
    const invoice = useRecoilValue(invoiceValue);
    const handleCreateOnlinePayment = async (invoice: Invoices) => {
        try {
            const res = await paymentService.create(invoice);
            console.log(res);
            window.location.href = res?.data?.order_url;
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        console.log(invoice);
        console.log(newAppointment.createdAt);
    }, []);
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
                <Text>Chúc mừng, bạn đã đặt lịch hẹn khám thành công.</Text>
                {invoice.paymentMethod === 2 && (
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
                    {invoice.paymentMethod === 2 && (
                        <Button
                            type="primary"
                            onClick={() => {
                                handleCreateOnlinePayment(invoice);
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
