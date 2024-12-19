import { Button, Input, Modal, Form, Row, Col, Rate } from 'antd';
import { CommentService } from '../../../../services/commentService';
import { Comment } from '../../../../models/comment';
import { Appointment } from '../../../../models/appointment';
const { TextArea } = Input;

export const InputCommentModal = ({
    openInputModal,
    handleCancelInputModal,
    appointment,
    setAppointments,
    openNotificationWithIcon,
    handleCancelModalInput,
}: any) => {
    const [form] = Form.useForm();

    const createCommentForPatient = async (newComment: Comment) => {
        try {
            const data = {
                newComment: newComment,
                appointmentId: appointment.id,
            };
            const res = await CommentService.createComment(data);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Thêm phản hồi thành công!'
            );
            handleUpdateIsEvaluateAppointment();
            handleCancelModalInput();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'errpr',
                'Thông báo',
                'Thêm phản hồi không thành công!'
            );
        }
    };
    const handleUpdateIsEvaluateAppointment = () => {
        setAppointments((prevAppointments: Appointment[]) => {
            const updatedAppointments = [...prevAppointments];
            const index = updatedAppointments.findIndex(
                (app) => app.id === appointment.id
            );
            if (index !== -1) {
                updatedAppointments[index] = {
                    ...updatedAppointments[index],
                    isEvaluate: 1,
                };
            }
            return updatedAppointments;
        });
    };
    const onFinish = (values: any) => {
        console.log(values);
        console.log(appointment);

        const data: Comment = {
            id: 0,
            full_name: appointment.patient_name,
            phone: appointment.patient_phone,
            date_booking: appointment.appointment_date,
            content: values.content,
            star: values.star,
            doctor_id: appointment.doctor_id,
            type: 'Bác sĩ',
        };
        createCommentForPatient(data);
    };

    return (
        <Modal
            onCancel={handleCancelInputModal}
            open={openInputModal}
            maskClosable={false}
            title={<h3 className="fs-5">Thêm bình luận</h3>}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => form.submit()}
                >
                    Bình luận
                </Button>,
                <Button key="back" onClick={handleCancelInputModal}>
                    Đóng
                </Button>,
            ]}
            className="w-50"
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name={'star'}
                            label="Số sao"
                            initialValue={3}
                        >
                            <Rate allowHalf />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name={'content'}
                            label="Nội dung"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
