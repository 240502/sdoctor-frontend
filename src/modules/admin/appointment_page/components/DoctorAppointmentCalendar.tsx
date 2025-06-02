import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Alert, Modal, Select, Row, Col } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AppointmentResponseDto } from '../../../../models';
import { useFetchAppointmentsByMonthAndYear } from '../../../../hooks/appointments/useAppointment';
import { useNavigate } from 'react-router-dom';

// Hàm lấy màu sắc dựa trên trạng thái lịch hẹn
const getStatusColor = (status: number) => {
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
    userId: number;
}
const DoctorAppointmentCalendar = ({
    userId,
}: DoctorAppointmentCalendarProps) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [options, setOptions] = useState<{
        fromDate: string;
        toDate: string;
        doctorId: number;
    }>({
        fromDate: dayjs().startOf('month').startOf('week').format('YYYY-MM-DD'),
        toDate: dayjs().endOf('month').endOf('week').format('YYYY-MM-DD'),
        doctorId: userId,
    });

    const { data, isError, isFetching } =
        useFetchAppointmentsByMonthAndYear(options);

    const dateCellRender = (value: Dayjs) => {
        const appointments: AppointmentResponseDto[] = [];
        if (!isFetching && !isError) {
            data?.forEach((appointment: AppointmentResponseDto) => {
                if (
                    dayjs(appointment.appointmentDate).format('YYYY-MM-DD') ===
                    value.format('YYYY-MM-DD')
                ) {
                    appointments.push(appointment);
                }
            });
        }
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {appointments?.map((item: AppointmentResponseDto) => (
                    <li key={item.id} style={{ marginBottom: 4 }}>
                        <Badge
                            color={getStatusColor(item.statusId)}
                            text={`${item.startTime} - ${item.patientName}`}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (value: Dayjs) => {
        setSelectedDate(value);
        const appointments: AppointmentResponseDto[] = [];
        data?.forEach((appointment: AppointmentResponseDto) => {
            if (
                dayjs(appointment.appointmentDate).format('YYYY-MM-DD') ===
                value.format('YYYY-MM-DD')
            ) {
                appointments?.push(appointment);
            }
        });
        if (appointments?.length > 0) {
            const modalInstance = Modal.info({
                title: `Lịch hẹn ngày ${value.format('DD-MM-YYYY')}`,
                content: (
                    <Row gutter={[24, 24]}>
                        {appointments?.map((appointment) => (
                            <Col
                                span={12}
                                key={appointment.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    modalInstance.destroy();
                                    const queryParams = new URLSearchParams();
                                    queryParams.append(
                                        'appointment',
                                        appointment.id.toString()
                                    );
                                    navigate(
                                        `/admin/appointment-detail?${queryParams}`
                                    );
                                }}
                            >
                                <span>
                                    {appointment.startTime} -{' '}
                                    {appointment.endTime} :{' '}
                                    {appointment.patientName} (
                                    {appointment.statusName})
                                </span>
                            </Col>
                        ))}
                    </Row>
                ),
                width: '50%',
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
                cellRender={dateCellRender}
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
                                <Select
                                    className="w-25"
                                    value={year}
                                    onChange={(year: number) => {
                                        onChange(value.clone().year(year));
                                        const newValue = value
                                            .clone()
                                            .year(year);
                                        setOptions({
                                            ...options,
                                            fromDate: newValue
                                                .startOf('month')
                                                .startOf('week')
                                                .format('YYYY-MM-DD'),
                                            toDate: newValue
                                                .endOf('month')
                                                .endOf('week')
                                                .format('YYYY-MM-DD'),
                                        });
                                    }}
                                >
                                    {yearOptions}
                                </Select>
                                <Select
                                    className="w-25 ms-3"
                                    value={month}
                                    onChange={(newMonth: number) => {
                                        const newValue = value
                                            .clone()
                                            .month(newMonth);
                                        console.log(newMonth, newValue);

                                        setOptions({
                                            ...options,
                                            fromDate: newValue
                                                .startOf('month')
                                                .startOf('week')
                                                .format('YYYY-MM-DD'),
                                            toDate: newValue
                                                .endOf('month')
                                                .endOf('week')
                                                .format('YYYY-MM-DD'),
                                        });
                                        onChange(value.clone().month(newMonth));
                                    }}
                                >
                                    {monthOptions}
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
