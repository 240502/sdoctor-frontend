import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';

import FormTabs from './FormTabs';
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export const DoctorModal = ({
    showDoctorModal,
    handleCloseDoctorModal,
    openMessage,
    isUpdate,
    refetch,
}: any) => {
    return (
        <Modal
            className="w-75 input-doctor-modal"
            title={'Thêm bác sĩ'}
            open={showDoctorModal}
            maskClosable={false}
            onCancel={handleCloseDoctorModal}
            footer={[<Button onClick={handleCloseDoctorModal}>Đóng</Button>]}
        >
            <FormTabs
                openMessage={openMessage}
                isUpdateDoctor={isUpdate}
                refetch={refetch}
            />
        </Modal>
    );
};
