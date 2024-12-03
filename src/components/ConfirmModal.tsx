import { Modal, Button } from 'antd';

const ConfirmModal = ({
    message,
    openModal,
    handleCancelModal,
    handleOk,
}: any) => {
    return (
        <Modal
            title={'Thông báo'}
            onCancel={handleCancelModal}
            open={openModal}
            maskClosable={false}
            footer={[
                <Button
                    key={'ok'}
                    className="bg-danger text-white"
                    onClick={handleOk}
                >
                    Xác nhận
                </Button>,
                <Button key={'cancel'} onClick={handleCancelModal}>
                    Đóng
                </Button>,
            ]}
        >
            <p>{message}</p>
        </Modal>
    );
};
export default ConfirmModal;
