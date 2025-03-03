import { Button, Modal } from 'antd';
import { PostService } from '../../../../services/postService';

export const ModalConfirmDeleteNews = ({
    isShowModalConfirm,
    handleCloseModalConfirm,
    post,
    header,
    openNotificationWithIcon,
    loadData,
}: any) => {
    const handleDelete = async () => {
        try {
            const res = await PostService.deletePost(post.id, header);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo!',
                'Xóa thành công!'
            );
            handleCloseModalConfirm();
            loadData();
        } catch (err: any) {
            console.log(err.message);
            handleCloseModalConfirm();

            openNotificationWithIcon(
                'error',
                'Thông báo!',
                'Xóa không thành công!'
            );
        }
    };
    return (
        <Modal
            title="Thông báo"
            open={isShowModalConfirm}
            onCancel={handleCloseModalConfirm}
            footer={[
                <Button
                    danger
                    className="bg-danger text-white"
                    onClick={handleDelete}
                >
                    Xác nhận
                </Button>,
                <Button onClick={handleCloseModalConfirm}> Đóng</Button>,
            ]}
        >
            Bạn chắc chắn muốn xóa bài viết này?
        </Modal>
    );
};
