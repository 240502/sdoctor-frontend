import { Modal, Button } from 'antd';

interface ConfirmModalProps {
    message: string;
    isOpenModal: boolean;
    onCloseModal: () => void;
    handleOk: () => void;
}

const ConfirmModal = ({
    message,
    isOpenModal,
    onCloseModal,
    handleOk,
}: ConfirmModalProps) => {
    return (
        <Modal
            title={'Thông báo'}
            onCancel={onCloseModal}
            open={isOpenModal}
            maskClosable={false}
            footer={[
                <Button
                    key={'ok'}
                    className="bg-danger text-white"
                    onClick={handleOk}
                >
                    Xác nhận
                </Button>,
                <Button key={'cancel'} onClick={onCloseModal}>
                    Đóng
                </Button>,
            ]}
        >
            <p>{message}</p>
        </Modal>
    );
};
export default ConfirmModal;
