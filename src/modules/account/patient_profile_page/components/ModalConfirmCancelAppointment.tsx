import { Button, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { appointmentService } from '../../../../services';
import TextArea from 'antd/es/input/TextArea';
import { useUpdateAppointmentStatus } from '../../../../hooks/appointments/useUpdateAppointment';
import { AppointmentResponseDto } from '../../../../models';
import { NoticeType } from 'antd/es/message/interface';

export const ModalConfirmCancelAppointment = ({
    isOpenModalConfirm,
    handleCancelModalConfirm,
    appointment,
    setIsOpenModalConfirm,
    openNotification,
    refetch,
}: {
    isOpenModalConfirm: any;
    handleCancelModalConfirm: any;
    appointment: AppointmentResponseDto;
    setIsOpenModalConfirm: any;
    openNotification: (type: NoticeType, content: string) => void;
    refetch: any;
}) => {
    const rejectionReasonInputRef = useRef<any>(null);
    const focusTextArea = () => {
        if (rejectionReasonInputRef.current) {
            rejectionReasonInputRef.current.focus();
        }
    };
    const {
        mutate: updateAppointmentStatus,
        isPending,
        isSuccess,
        isError,
        error,
    } = useUpdateAppointmentStatus();
    const handleCancelAppointment = async () => {
        try {
            const data = {
                appointment: {
                    ...appointment,

                    rejectionReason:
                        rejectionReasonInputRef.current?.resizableTextArea
                            ?.textArea.value,
                },
                requirementObject: 'Bệnh nhân',
            };
            // const res = await appointmentService.createAppointment(data);

            openNotification('success', 'Hủy lịch hẹn thành công!');
            setIsOpenModalConfirm(false);
            refetch();
        } catch (err: any) {
            console.log(err.message);
            openNotification('error', 'Hủy lịch hẹn không thành công!');
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
                    onClick={() => {
                        const data = {
                            appointment: {
                                ...appointment,
                                statusId: 3,
                                rejectionReason:
                                    rejectionReasonInputRef.current
                                        ?.resizableTextArea?.textArea.value,
                            },
                            requirementObject: 'patient',
                        };
                        updateAppointmentStatus(data, {
                            onSuccess: (data) => {
                                console.log('Thành công:', data);
                                openNotification(
                                    'success',
                                    'Hủy lịch hẹn thành công!'
                                );
                                setIsOpenModalConfirm(false);
                                refetch();
                            },
                            onError: (err) => {
                                console.error('Lỗi:', err.message);
                                openNotification(
                                    'error',
                                    'Hủy lịch hẹn không thành công!'
                                );
                            },
                        });
                    }}
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
