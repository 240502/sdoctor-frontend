import { Button, Modal } from 'antd';
import { doctorService } from '../../../../services';
export const ModalConfirmDelete = ({
    showModalConfirm,
    handleCloseModalConfirm,
    doctorId,
    openNotificationWithIcon,
    getDoctors,
    config,
}: any) => {
    const DeleteDoctor = async () => {
        try {
            const res = await doctorService.deleteDoctor(doctorId);
            console.log(res);
            openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công');
            getDoctors();
            handleCloseModalConfirm();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'error',
                'Thông báo',
                'Xóa không thành công'
            );
        }
    };
    return (
        <Modal
            open={showModalConfirm}
            onCancel={handleCloseModalConfirm}
            title="Thông báo"
            footer={[
                <Button
                    danger
                    className="bg-danger text-white"
                    onClick={() => DeleteDoctor()}
                >
                    Xác nhận
                </Button>,
                <Button onClick={handleCloseModalConfirm}>Đóng</Button>,
            ]}
        >
            <p>Bạn chắc chắn muốn xóa bác sĩ này?</p>
        </Modal>
    );
};
