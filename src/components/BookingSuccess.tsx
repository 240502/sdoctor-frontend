import { Card, Typography, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { newAppointmentValue } from '../stores/appointmentAtom';

const { Title, Text } = Typography;
export const BookingSuccess = () => {
    const navigate = useNavigate();
    const newAppointment = useRecoilValue(newAppointmentValue);
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
                <div style={{ marginTop: '24px', textAlign: 'left' }}>
                    <Text strong>Bác sĩ:</Text>{' '}
                    <Text>{newAppointment.doctor_name}</Text> <br />
                    <Text strong>Ngày:</Text>{' '}
                    <Text>
                        {newAppointment.appointment_date
                            .toString()
                            .slice(0, 10)}
                    </Text>{' '}
                    <br />
                    <Text strong>Giờ:</Text>{' '}
                    <Text>{newAppointment.time_value}</Text> <br />
                    <Text strong>Dịch vụ:</Text>{' '}
                    <Text>{newAppointment.service_name}</Text>
                </div>
                <Space style={{ marginTop: '24px' }}>
                    <Button type="primary" onClick={() => navigate('/')}>
                        Về trang chính
                    </Button>
                    <Button onClick={() => navigate('/')}>Xem chi tiết</Button>
                </Space>
            </Card>
        </div>
    );
};
