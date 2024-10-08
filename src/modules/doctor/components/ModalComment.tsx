import { Button, Modal } from 'antd';

export const ModalComment = ({
    isModalCommentOpen,
    setIsModalCommentOpen,
}: any): JSX.Element => {
    const handleCancel = () => {
        setIsModalCommentOpen(false);
    };
    const handleOk = () => {};
    return (
        <Modal
            onCancel={handleCancel}
            open={isModalCommentOpen}
            maskClosable={false}
            title={<h3 className="fs-5">Thêm bình luận</h3>}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                    Bình luận
                </Button>,
                <Button key="back" onClick={handleCancel}>
                    Đóng
                </Button>,
            ]}
        ></Modal>
    );
};
