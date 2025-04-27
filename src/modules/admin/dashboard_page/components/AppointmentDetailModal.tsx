import React, { useEffect } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import { AppointmentResponseDto } from '../../../../models';
import dayjs from 'dayjs'; // 👉 nhớ import thêm dayjs
interface ApppointmentDeailProps {
    appointment: AppointmentResponseDto;
    isModalOpen: boolean;
    cancelModal: () => void;
}

const AppointmentDetailModal = (props: ApppointmentDeailProps) => {
    useEffect(() => {
        console.log('appointment', props.appointment);
    }, []);
    const calculateAge = (birthday: string) => {
        return dayjs().diff(dayjs(birthday), 'year');
    };
    return (
        <Modal
            title={<h6 className="border-bottom pb-3"> Chi tiết lịch hẹn</h6>}
            open={props.isModalOpen}
            onCancel={props.cancelModal}
            footer={[<Button onClick={props.cancelModal}>Đóng</Button>]}
        >
            <h6 className="patient-name pb-2">
                {props.appointment.patientName}
            </h6>
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <strong>Tuổi : </strong>
                    {calculateAge(
                        props.appointment.birthday.toString().split('T')[0]
                    ) + ' Tuổi'}
                </Col>
                <Col span={12}>
                    <strong>Ngày hẹn : </strong>
                    {dayjs(props.appointment.appointmentDate).format(
                        'DD-MM-YYYY'
                    )}
                </Col>
                <Col span={12}>
                    <strong>Giới tính : </strong>
                    {props.appointment.gender === 1 ? 'Nam' : 'Nữ'}
                </Col>
                <Col span={12}>
                    <strong>Thời gian : </strong>
                    {props.appointment.startTime +
                        '-' +
                        props.appointment.endTime}
                </Col>
                <Col span={12}>
                    <strong>Chuyên khoa : </strong>
                    {props.appointment.serviceName}
                </Col>
                <Col span={12}>
                    {' '}
                    <strong> Bác sĩ : </strong>
                    {props.appointment.doctorName}
                </Col>
            </Row>
        </Modal>
    );
};

export default AppointmentDetailModal;
