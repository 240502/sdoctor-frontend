import { Modal, Button } from 'antd';
import { useRecoilValue } from 'recoil';
import { patientProfileValue } from '../../../../stores/patientAtom';
export const ModalConfirmDeletePatientProfile = ({
    handleCancelModalConfirm,
    isOpenModalConfirm,
    handleDeleteProfile,
}: any) => {
    const patientProfile = useRecoilValue(patientProfileValue);
    return (
        <>
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
                    <Button
                        key={'ok'}
                        className="bg-danger text-white"
                        onClick={() => handleDeleteProfile(patientProfile.uuid)}
                    >
                        Xác nhận
                    </Button>,
                    <Button key={'back'} onClick={handleCancelModalConfirm}>
                        Đóng
                    </Button>,
                ]}
            >
                <p className="fw-bold">Bạn chắc chắn muốn xóa hồ sơ ?</p>
            </Modal>
        </>
    );
};
