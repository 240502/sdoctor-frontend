import { Button, Modal, Input } from 'antd';
import { useRef } from 'react';
const TextArea = Input.TextArea;
const ConfirmAppointmentModal = ({
    type,
    message,
    openModalConfirm,
    handleCancelModalConfirm,
    handleOk,
    rejectionReasonInputRef,
}: any) => {
    return (
        <Modal
            title={'Thông báo'}
            onCancel={handleCancelModalConfirm}
            open={openModalConfirm}
            maskClosable={false}
            footer={[
                <Button
                    key={'ok'}
                    className={`${
                        type === 'delete' ? 'bg-danger' : 'bg-primary'
                    } text-white `}
                    onClick={handleOk}
                >
                    Xác nhận
                </Button>,
                <Button key={'back'} onClick={handleCancelModalConfirm}>
                    Đóng
                </Button>,
            ]}
        >
            <p>{message} </p>
            {type === 'delete' && (
                <>
                    <p>Hãy nhập lý do hủy hẹn ở ô dưới đây.</p>
                    <TextArea ref={rejectionReasonInputRef}></TextArea>
                </>
            )}
        </Modal>
    );
};
export default ConfirmAppointmentModal;
