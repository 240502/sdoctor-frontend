import {
    Button,
    Input,
    InputRef,
    Modal,
    DatePicker,
    Form,
    Row,
    Col,
    Rate,
} from 'antd';
import type { DatePickerProps } from 'antd';

import { useRef, useState } from 'react';
import {
    handleFocusInput,
    handleFocusSelect,
    isEmpty,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../../utils/global';
import {
    isEmptyDatePicker,
    validateDateBooking,
} from '../../../../utils/comment';
import { CommentService } from '../../../../services/commentService';
import { Comment } from '../../../../models/comment';
const { TextArea } = Input;

export const InputCommentModal = ({
    openInputModal,
    handleCancelInputModal,
    appointment,
    openNotificationWithIcon,
    doctorId,
    isModalCommentOpen,
    setIsModalCommentOpen,
}: any) => {
    const [form] = Form.useForm();

    const createCommentForPatient = async (newComment: Comment) => {
        try {
            const res = await CommentService.createComment(newComment);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Thêm phản hồi thành công!'
            );
            setIsModalCommentOpen(false);
        } catch (err: any) {
            console.log(err.message);
        }
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
