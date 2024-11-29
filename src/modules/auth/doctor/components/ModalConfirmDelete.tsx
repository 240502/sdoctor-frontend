import { Button, Modal } from 'antd';
import { doctorService } from '../../../../services/doctorService';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';
export const ModalConfirmDelete = ({
    showModalConfirm,
    handleCloseModalConfirm,
    doctorId,
    openNotificationWithIcon,
    getDoctors,
}: any) => {
    const user = useRecoilValue(userValue);
    const DeleteDoctor = async () => {
        try {
            const header = {
                headers: { authorization: 'Bearer ' + user.token },
            };
            const res = await doctorService.deleteDoctor(doctorId, header);
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
