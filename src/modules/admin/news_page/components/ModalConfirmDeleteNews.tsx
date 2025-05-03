import { Button, Modal } from 'antd';
import { useDeletePost } from '../../../../hooks';
import { Post } from '../../../../models';

interface ConfirmDeletePostModalProps {
    isShowModalConfirm: boolean;
    handleCloseConfirmModal: () => void;
    post: Post;
    openNotification: (type: any, title: string, des: string) => void;
    refetch: () => void;
}

export const ModalConfirmDeleteNews = ({
    isShowModalConfirm,
    handleCloseConfirmModal,
    post,
    openNotification,
    refetch,
}: ConfirmDeletePostModalProps) => {
    const { mutate: DeletePost } = useDeletePost();
    const handleDelete = async () => {
        DeletePost(post.id, {
            onSuccess() {
                openNotification('success', 'Thông báo!', 'Xóa thành công!');
                handleCloseConfirmModal();
                refetch();
            },
            onError() {
                openNotification(
                    'error',
                    'Thông báo!',
                    'Xóa không thành công!'
                );
                handleCloseConfirmModal();
            },
        });
    };
    return (
        <Modal
            title="Thông báo"
            open={isShowModalConfirm}
            onCancel={handleCloseConfirmModal}
            maskClosable={false}
            footer={[
                <Button
                    danger
                    className="bg-danger text-white"
                    onClick={handleDelete}
                >
                    Xác nhận
                </Button>,
                <Button onClick={handleCloseConfirmModal}> Đóng</Button>,
            ]}
        >
            Bạn chắc chắn muốn xóa bài viết này?
        </Modal>
    );
};
