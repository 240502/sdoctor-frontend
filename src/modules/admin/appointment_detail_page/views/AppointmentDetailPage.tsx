import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Flex,
    Row,
    Skeleton,
    Tag,
} from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchAppointmentById } from '../../../../hooks';
import { useEffect } from 'react';
import { useFetchRecentAppointments } from '../../../../hooks/appointments/useFetchRecentAppointment';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../../stores/userAtom';

const AppointmentDetailPage = () => {
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        data: appointment,
        isError,
        error,
        isFetching,
    } = useFetchAppointmentById(Number(searchParams.get('appointment')));
    const {
        data: fetchRecentAppointmentsRes,
        isError: isfetchRecentAppointmentsError,
        error: fetchRecentAppointmentsError,
        isFetching: isFetchingRecentAppointments,
    } = useFetchRecentAppointments({
        entityId: user.userId,
        limit: 2,
        withoutId: Number(searchParams.get('appointment')),
    });
    useEffect(() => {
        console.log('appointment', appointment);
    }, [appointment]);
    return (
        <Row gutter={24}>
            <Col span={24}>
                <Button
                    className="border-0 d-inline-block"
                    onClick={() => {
                        navigate('/admin/appointment');
                    }}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </Button>
                <h6 className="mb-0 d-inline-block">Chi tiết lịch hẹn</h6>
            </Col>
            <Divider className="mt-2 mb-2" />

            <Skeleton active loading={isFetching}>
                {isError ? (
                    <p className="fw-bold text-center">
                        {error.message.includes('404')
                            ? 'Không tìm thấy dữ liệu lịch hẹn !'
                            : error.message}
                    </p>
                ) : (
                    <Card className="w-100 shadow">
                        <Row gutter={24}>
                            <Col span={10}>
                                <p className="fw-medium text-primary">
                                    #Apt
                                    {appointment?.id &&
                                    appointment?.id?.toString()?.length > 4
                                        ? appointment?.id
                                        : `00${appointment?.id}`}
                                </p>
                                <h6 className="text-dark">
                                    {' '}
                                    {appointment?.patientName}{' '}
                                </h6>
                                <p
                                    className="mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    <i className="fa-solid fa-envelope"></i>
                                    <span className="ms-2">
                                        {appointment?.patientEmail}
                                    </span>
                                </p>
                                <p
                                    className="mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    <i className="fa-solid fa-phone"></i>
                                    <span className="ms-2">
                                        {appointment?.patientPhone}
                                    </span>
                                </p>
                            </Col>
                            <Col span={6}>
                                <p className="fw-medium fs-6 mb-2">
                                    Loại cuộc hẹn
                                </p>
                                <span>
                                    <i className="fa-solid fa-hospital text-success"></i>{' '}
                                    <span className="fw-medium">
                                        Tư vấn trực tiếp
                                    </span>
                                </span>
                            </Col>
                            <Col span={8} className="text-end">
                                <Tag
                                    color="#6B7280"
                                    className="p-2 rounded-5 fw-medium"
                                >
                                    Bệnh nhân mới
                                </Tag>
                                <Tag
                                    color="#FFCA18"
                                    className="p-2 rounded-5 fw-medium"
                                >
                                    Sắp tới
                                </Tag>
                                <p className="fw-medium mt-2">
                                    Chi phí tư vấn :{' '}
                                    {appointment?.amount.toLocaleString(
                                        undefined
                                    )}{' '}
                                    VND
                                </p>
                                <div className="">
                                    <Button
                                        className="rounded-circle  border-0 "
                                        style={{ background: '#E6E8EE' }}
                                    >
                                        <i className="fa-solid fa-message"></i>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Divider className="mt-2 mb-2" />
                        <Row gutter={24}>
                            <Col span={6}>
                                <p
                                    className="fw-medium mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    Ngày & Thời gian <br />
                                </p>
                                <p
                                    style={{ color: '#012047' }}
                                    className="mb-0"
                                >
                                    {dayjs(
                                        appointment?.appointmentDate
                                            .toString()
                                            .split('T')[0]
                                    ).format('DD/MM/YYYY')}{' '}
                                    - {appointment?.startTime}
                                </p>
                            </Col>

                            <Col span={6}>
                                <p
                                    className="fw-medium mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    Cơ sở y tế <br />
                                </p>
                                <p
                                    style={{ color: '#012047' }}
                                    className="mb-0"
                                >
                                    {appointment?.clinicName}
                                </p>
                            </Col>
                            <Col span={6}>
                                <p
                                    className="fw-medium mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    Địa chỉ <br />
                                </p>
                                <p
                                    style={{ color: '#012047' }}
                                    className="mb-0"
                                >
                                    {appointment?.location}
                                </p>
                            </Col>
                            <Col span={6}>
                                <p
                                    className="fw-medium mb-2"
                                    style={{ color: '#465D7C' }}
                                >
                                    Dịch vụ khám <br />
                                </p>
                                <p
                                    style={{ color: '#012047' }}
                                    className="mb-0"
                                >
                                    {appointment?.serviceName}
                                </p>
                            </Col>
                        </Row>
                    </Card>
                )}
            </Skeleton>

            <Col span={24}>
                <h6 className="mt-3">Lịch hẹn gần đây</h6>
            </Col>
            <Skeleton active loading={isFetchingRecentAppointments}>
                {isfetchRecentAppointmentsError ? (
                    <p className="fw-bold text-center">
                        {error?.message.includes('404')
                            ? 'Không có lịch hẹn nào !'
                            : error?.message}
                    </p>
                ) : (
                    fetchRecentAppointmentsRes?.appointments.map(
                        (appointment) => {
                            return (
                                <Card className="w-100 shadow mt-3">
                                    <Row gutter={24} justify={'space-between'}>
                                        <Col span={4}>
                                            <p className="fw-medium text-primary mb-2">
                                                #Apt{' '}
                                                {appointment?.id &&
                                                appointment?.id?.toString()
                                                    ?.length > 4
                                                    ? appointment?.id
                                                    : `00${appointment?.id}`}
                                            </p>
                                            <h6 className="text-dark">
                                                {appointment.patientName}
                                            </h6>
                                        </Col>
                                        <Col span={4}>
                                            <p
                                                style={{ color: '#012047' }}
                                                className="mb-2"
                                            >
                                                <i className="fa-solid fa-clock"></i>{' '}
                                                {dayjs(
                                                    appointment?.appointmentDate
                                                        .toString()
                                                        .split('T')[0]
                                                ).format('DD/MM/YYYY')}{' '}
                                                - {appointment?.startTime}
                                            </p>
                                            <p className="text-dark fw-medium mb-0">
                                                {appointment?.serviceName} | Tư
                                                vấn trực tiếp
                                            </p>
                                        </Col>
                                        <Col span={4}>
                                            <p
                                                className="mb-2"
                                                style={{ color: '#465D7C' }}
                                            >
                                                <i className="fa-solid fa-envelope"></i>
                                                <span className="ms-2">
                                                    {appointment.patientEmail}
                                                </span>
                                            </p>
                                            <p
                                                className="mb-0"
                                                style={{ color: '#465D7C' }}
                                            >
                                                <i className="fa-solid fa-phone"></i>
                                                <span className="ms-2">
                                                    {appointment.patientPhone}
                                                </span>
                                            </p>
                                        </Col>
                                        <Col
                                            span={4}
                                            className="d-flex align-items-center justify-content-center"
                                        >
                                            <Button
                                                className="rounded-5 border-0"
                                                style={{
                                                    background: '#E6E8EE',
                                                }}
                                                onClick={() => {
                                                    const queryParams =
                                                        new URLSearchParams();
                                                    queryParams.append(
                                                        'appointment',
                                                        appointment.id.toString()
                                                    );
                                                    navigate(
                                                        `/admin/appointment-detail?${queryParams}`
                                                    );
                                                }}
                                            >
                                                <EyeOutlined className="fw-medium fs-6" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        }
                    )
                )}
            </Skeleton>
        </Row>
    );
};

export default AppointmentDetailPage;
