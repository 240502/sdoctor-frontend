import React from 'react';
import { Calendar, Badge, Alert, Modal } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// Định nghĩa kiểu dữ liệu cho lịch hẹn
interface Appointment {
    id: string;
    startTime: string; // ISO string, e.g., "2025-06-01T09:00:00Z"
    endTime: string;
    title: string; // Tên bệnh nhân hoặc mô tả
    status: 'confirmed' | 'pending' | 'canceled';
}

// Dữ liệu giả lập lịch hẹn
const appointments: Appointment[] = [
    {
        id: '1',
        startTime: '2025-06-01T09:00:00Z',
        endTime: '2025-06-01T09:30:00Z',
        title: 'Khám bệnh nhân Nguyễn Văn A',
        status: 'confirmed',
    },
    {
        id: '2',
        startTime: '2025-06-01T10:00:00Z',
        endTime: '2025-06-01T10:30:00Z',
        title: 'Khám bệnh nhân Trần Thị B',
        status: 'pending',
    },
    {
        id: '3',
        startTime: '2025-06-02T14:00:00Z',
        endTime: '2025-06-02T14:30:00Z',
        title: 'Tái khám bệnh nhân Lê Văn C',
        status: 'confirmed',
    },
];

// Hàm lấy danh sách lịch hẹn theo ngày
const getAppointmentsByDate = (date: Dayjs): Appointment[] => {
    return appointments.filter((appointment) =>
        dayjs(appointment.startTime).isSame(date, 'day')
    );
};

// Hàm lấy màu sắc dựa trên trạng thái lịch hẹn
const getStatusColor = (status: Appointment['status']): string => {
    switch (status) {
        case 'confirmed':
            return 'green';
        case 'pending':
            return 'orange';
        case 'canceled':
            return 'red';
        default:
            return 'gray';
    }
};

const DoctorAppointmentCalendar: React.FC = () => {
    // State để lưu ngày được chọn
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

    // Hàm hiển thị nội dung ô ngày
    const dateCellRender = (value: Dayjs) => {
        const listData = getAppointmentsByDate(value);
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {listData.map((item) => (
                    <li key={item.id} style={{ marginBottom: 4 }}>
                        <Badge
                            color={getStatusColor(item.status)}
                            text={`${dayjs(item.startTime).format('HH:mm')} - ${
                                item.title
                            }`}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    // Hàm xử lý khi chọn ngày
    const onSelect = (value: Dayjs) => {
        setSelectedDate(value);
        const appointmentsOnDate = getAppointmentsByDate(value);
        if (appointmentsOnDate.length > 0) {
            Modal.info({
                title: `Lịch hẹn ngày ${value.format('YYYY-MM-DD')}`,
                content: (
                    <ul>
                        {appointmentsOnDate.map((appointment) => (
                            <li key={appointment.id}>
                                {dayjs(appointment.startTime).format('HH:mm')} -{' '}
                                {dayjs(appointment.endTime).format('HH:mm')} :{' '}
                                {appointment.title} ({appointment.status})
                            </li>
                        ))}
                    </ul>
                ),
                onOk() {},
            });
        } else {
            Modal.info({
                title: `Lịch hẹn ngày ${value.format('YYYY-MM-DD')}`,
                content: 'Không có lịch hẹn trong ngày này.',
                onOk() {},
            });
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Alert
                message={`Ngày được chọn: ${
                    selectedDate
                        ? selectedDate.format('YYYY-MM-DD')
                        : 'Chưa chọn'
                }`}
                type="info"
                style={{ marginBottom: 16 }}
            />
            <Calendar
                dateCellRender={dateCellRender}
                onSelect={onSelect}
                fullscreen={true}
                headerRender={({ value, onChange }) => {
                    const year = value.year();
                    const month = value.month();
                    const monthOptions = [];
                    const yearOptions = [];

                    // Tạo danh sách tháng
                    for (let i = 0; i < 12; i++) {
                        monthOptions.push(
                            <option key={i} value={i}>
                                {dayjs().month(i).format('MMMM')}
                            </option>
                        );
                    }

                    // Tạo danh sách năm (10 năm trước và sau)
                    for (let i = year - 10; i <= year + 10; i++) {
                        yearOptions.push(
                            <option key={i} value={i}>
                                {i}
                            </option>
                        );
                    }

                    return (
                        <div style={{ padding: 8, display: 'flex', gap: 8 }}>
                            <select
                                value={year}
                                onChange={(e) => {
                                    const newYear = parseInt(e.target.value);
                                    onChange(value.clone().year(newYear));
                                }}
                            >
                                {yearOptions}
                            </select>
                            <select
                                value={month}
                                onChange={(e) => {
                                    const newMonth = parseInt(e.target.value);
                                    onChange(value.clone().month(newMonth));
                                }}
                            >
                                {monthOptions}
                            </select>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default DoctorAppointmentCalendar;
