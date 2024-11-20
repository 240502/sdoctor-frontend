import { Button, Modal } from 'antd';
import React from 'react';
import { AppointmentService } from '../../../../services/appointmentService';

export const ModalConfirmCancelAppointment = ({
    isOpenModalConfirm,
    handleCancelModalConfirm,
    appointmentId,
    setIsOpenModalConfirm,
    openNotificationWithIcon,
    getAppointmentByPatientPhone,
}: any) => {
    const handleCancelAppointment = async () => {
        try {
            const res = await AppointmentService.cancelAppointment(
                appointmentId
            );
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Hủy lịch hẹn thành công!'
            );
            setIsOpenModalConfirm(false);
            getAppointmentByPatientPhone();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Hủy lịch hẹn không thành công!'
            );
        }
    };
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
            Bạn chắc chắn muốn hủy lịch hẹn này
        </Modal>
    );
};
