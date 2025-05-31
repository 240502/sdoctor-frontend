import React, {useEffect, useState} from 'react';
import { Calendar, Badge, Alert, Modal, Select, Row, Col } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useFetchAppointmentWithOptions } from '../../../../hooks/appointments/useFetchAppointmentWithOptions';
import { AppointmentResponseDto } from '../../../../models';

// Định nghĩa kiểu dữ liệu cho lịch hẹn
interface Appointment {
    id: string;
    startTime: string; // ISO string, e.g., "2025-06-01T09:00:00Z"
    endTime: string;
    title: string; // Tên bệnh nhân hoặc mô tả
    status: 'confirmed' | 'pending' | 'canceled';
}



// Hàm lấy màu sắc dựa trên trạng thái lịch hẹn
const getStatusColor = (status:number) => {
    switch (status) {
        case 2:
            return 'green';
        case 1:
            return 'orange';
        case 3:
            return 'red';
        default:
            return 'gray';
    }
};
interface DoctorAppointmentCalendarProps {
    userId: number ;
}
const DoctorAppointmentCalendar = ({userId}:DoctorAppointmentCalendarProps) => {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
    const [options, setOptions] = useState<{
            pageIndex: number;
            pageSize: number;
            status: number | null;
            userId: number;
            fromDate: Dayjs;
            toDate: Dayjs;
        }>({
            userId: userId,
            pageIndex: 1,
            pageSize: 8,
            status: null,
            fromDate: dayjs().startOf('isoWeek'),
            toDate: dayjs().endOf('isoWeek'),
        });
        const { data, isError, isFetching } =
            useFetchAppointmentWithOptions(options);
    const dateCellRender = (value: Dayjs) => {
        console.log("values",value);
        
        const appointments: AppointmentResponseDto[] = [];
        if (!isFetching && !isError) {
            data?.appointments.forEach((appointment:AppointmentResponseDto) => {
                if (dayjs(appointment.appointmentDate).format("YYYY-MM-DD") === value.format("YYYY-MM-DD")) {
                    appointments.push(appointment)
                }
            })
          
        }
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {appointments?.map((item:AppointmentResponseDto) => (
                    <li key={item.id} style={{ marginBottom: 4 }}>
                        <Badge
                            color={getStatusColor(item.statusId)}
                            text={`${(item.startTime)} - ${
                                item.patientName
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
        const appointments: AppointmentResponseDto[] = [];
        data?.appointments.forEach((appointment:AppointmentResponseDto) => {
            if (dayjs(appointment.appointmentDate).format("YYYY-MM-DD") === value.format("YYYY-MM-DD")) {
                appointments.push(appointment)
            }
        })
        if (appointments.length > 0) {
            Modal.info({
                title: `Lịch hẹn ngày ${value.format('DD-MM-YYYY')}`,
                content: (
                    <ul>
                        {appointments.map((appointment) => (
                            <li key={appointment.id}>
                                {(appointment.startTime)} -{' '}
                                {(appointment.endTime)} :{' '}
                                {appointment.patientName} ({appointment.statusName})
                            </li>
                        ))}
                    </ul>
                ),
                onOk() {},
            });
        } else {
            Modal.info({
                title: `Lịch hẹn ngày ${value.format('DD-MM-YYYY')}`,
                content: 'Không có lịch hẹn trong ngày này.',
                onOk() {},
            });
        }
    };

    return (
        <>
            <Alert
                message={`Ngày được chọn: ${
                    selectedDate
                        ? selectedDate.format('DD-MM-YYYY')
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
                    for (let i = 0; i < 12; i++) {
                        monthOptions.push(
                            <Select.Option key={i} value={i}>
                                {dayjs().month(i).format('MMMM')}
                            </Select.Option>
                        );
                    }

                    for (let i = year - 5; i <= year + 5; i++) {
                        yearOptions.push(
                            <Select.Option key={i} value={i}>
                                Năm {i}
                            </Select.Option>
                        );
                    }

                    return (
                        <Row gutter={24}>
                            <Col span={12}>
                                <Select className='w-25' value={year}
                                    onChange={(year: number) => {
                                        onChange(value.clone().year(year))
                                    }}
                                >
                                    {
                                        yearOptions
                                    }
                                </Select>
                                <Select className='w-25 ms-3' value={month}
                                    onChange={(newMonth: number) => {
                                        onChange(value.clone().month(newMonth))
                                    }}
                                >
                                    {
                                        monthOptions
                                    }
                                </Select>
                            </Col>
                        </Row>
                    );
                }}
            />
        </>
    );
};

export default DoctorAppointmentCalendar;
