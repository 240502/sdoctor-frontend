import { Modal, Row, Col } from 'antd';

export const CalendarSchedulingDoctorModal = ({
    openCalendarModal,
    closeModal,
}: any) => {
    return (
        <Modal
            open={openCalendarModal}
            onCancel={closeModal}
            maskClosable={false}
            title={'Chọn thời giạn hẹn'}
        >
            <Row gutter={16}>
                <Col span={8}>
                    <h6>Chọn ngày</h6>
                </Col>
                <Col span={8}>
                    <h6>Chọn thời gian</h6>
                </Col>
            </Row>
        </Modal>
    );
};
