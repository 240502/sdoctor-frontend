import { Button, Input, InputRef, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { AppointmentService } from '../../../../services/appointmentService';
import { Appointment } from '../../../../models/appointment';

const TextArea = Input.TextArea;
export const ModalConfirmCancelAppointment = ({
    isOpenModalConfirm,
    handleCancelModalConfirm,
    appointment,
    setIsOpenModalConfirm,
    openNotificationWithIcon,
    setAppointments,
}: any) => {
    const rejectionReasonInputRef = useRef<any>(null);
    const focusTextArea = () => {
        if (rejectionReasonInputRef.current) {
            rejectionReasonInputRef.current.focus();
        }
    };

    const handleCancelAppointment = async () => {
        try {
            const data = {
                appointment: {
                    ...appointment,

                    rejectionReason:
                        rejectionReasonInputRef.current?.resizableTextArea
                            ?.textArea.value,
                },
                requirementObject: 'bác sĩ',
            };
            console.log(data);
            const res = await AppointmentService.updateAppointmentStatus(data);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Hủy lịch hẹn thành công!'
            );
            setIsOpenModalConfirm(false);
            setAppointments((prev: Appointment[]) =>
                prev.filter((item: Appointment) => item.id !== appointment.id)
            );
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Hủy lịch hẹn không thành công!'
            );
        }
    };
    useEffect(() => focusTextArea(), []);
    return (
        <Modal
            title={
                <h3 className="fs-5 text-capitalize border border-top-0 border-start-0 border-end-0 pb-2">
                    Thông báo
                </h3>
            }
            onCancel={handleCancelModalConfirm}
            open={isOpenModalConfirm}
            maskClosable={false}
            footer={[
                <Button key={'back'} onClick={handleCancelModalConfirm}>
                    Đóng
                </Button>,
                <Button
                    key={'ok'}
                    className="bg-danger text-white"
                    onClick={handleCancelAppointment}
                >
                    Xác nhận
                </Button>,
            ]}
        >
            <p className="fw-bold"> Bạn chắc chắn muốn hủy lịch hẹn này ?</p>
            <p>Hãy nhập lý do hủy hẹn ở ô dưới đây.</p>
            <TextArea ref={rejectionReasonInputRef}></TextArea>
        </Modal>
    );
};