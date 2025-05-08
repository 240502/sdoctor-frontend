import { Button, Input, Modal, Form, Row, Col, Rate } from 'antd';
import { CommentCreate } from '../../../../models/comment';
import { AppointmentResponseDto } from '../../../../models/appointment';
const { TextArea } = Input;
import { useCreateComment } from '../../../../hooks/comment/useCreateComment';
import { NoticeType } from 'antd/es/message/interface';

interface InputCommentModalProps {
    openInputModal: boolean;
    handleCancelInputModal: () => void;
    appointment: AppointmentResponseDto;
    openNotification: (type: NoticeType, content: string) => void;
    refetch: () => void;
}
export const InputCommentModal = ({
    openInputModal,
    handleCancelInputModal,
    appointment,
    openNotification,
    refetch,
}: InputCommentModalProps) => {
    const { mutate: CreateComment } = useCreateComment();
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        const data: CommentCreate = {
            fullName: appointment.patientName,
            content: values.content,
            starCount: Number(values.star),
            commentableId: appointment.doctorId,
            dateBooking: appointment.appointmentDate.toString().split('T')[0],
            commentableType: 'doctor',
        };
        CreateComment(
            { newComment: data, appointmentId: appointment.id },
            {
                onSuccess() {
                    handleCancelInputModal();
                    openNotification('success', 'Thêm đánh giá thành công !');
                    refetch();
                },
                onError(error) {
                    console.log('có lỗi khi thêm comment', error);
                    openNotification('error', 'Có lỗi khi thêm đánh giá !');
                },
            }
        );
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
