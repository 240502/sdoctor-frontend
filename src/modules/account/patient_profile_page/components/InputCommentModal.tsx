import { Button, Input, Modal, Form, Row, Col, Rate } from 'antd';
import { CommentService } from '../../../../services/commentService';
import { Comment, CommentCreate } from '../../../../models/comment';
import { Appointment } from '../../../../models/appointment';
import { useEffect, useState } from 'react';
import { NotificationService } from '../../../../services/notificationService';
import { useRecoilValue } from 'recoil';
import { doctorListState } from '../../../../stores/doctorAtom';
import { Doctor } from '../../../../models/doctor';
import { doctorService } from '../../../../services/doctorService';
const { TextArea } = Input;
import { NotificationCreate } from '../../../../models/notification';
import { AppointmentService } from '../../../../services/appointmentService';
export const InputCommentModal = ({
    openInputModal,
    handleCancelInputModal,
    appointment,
    setAppointments,
    openNotificationWithIcon,
    handleCancelModalInput,
}: any) => {
    const doctors = useRecoilValue(doctorListState);
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    useEffect(() => {
        const getDoctorById = async () => {
            const doctor =
                doctors.length > 0
                    ? doctors.find(
                          (doc: Doctor) => doc.doctorId === appointment.doctorId
                      )
                    : null;
            if (doctor) {
                setDoctor(doctor);
            } else {
                try {
                    const res = await doctorService.getDoctorById(
                        appointment.doctorId
                    );
                    console.log(res);
                    setDoctor(res);
                } catch (err: any) {
                    console.log(err.message);
                }
            }
        };
        getDoctorById();
    }, []);
    const [form] = Form.useForm();
    const createCommentForPatient = async (newComment: CommentCreate) => {
        try {
            const res = await CommentService.createComment(newComment);
            console.log(res);
            openNotificationWithIcon(
                'success',
                'Thông báo',
                'Thêm phản hồi thành công!'
            );
            handleUpdateIsEvaluationAppointment();
            handleCancelModalInput();
            handleCreateNotification();
        } catch (err: any) {
            console.log(err.message);
            openNotificationWithIcon(
                'errpr',
                'Thông báo',
                'Thêm phản hồi không thành công!'
            );
        }
    };
    const handleCreateNotification = () => {
        const newNotification: NotificationCreate = {
            userId: doctor.userId,
            message: 'Bạn có 1 bình luận mới!',
            appointmentId: null,
        };
        createNotification(newNotification);
    };
    const createNotification = async (newNotification: NotificationCreate) => {
        try {
            const res = await NotificationService.createNotification(
                newNotification
            );
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const handleUpdateIsEvaluationAppointment = async () => {
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
        try {
            const res = await AppointmentService.updateIsValuation(
                appointment.id
            );
            console.log(res);
        } catch (err: any) {
            console.log(err);
        }
    };
    const onFinish = (values: any) => {
        const data: CommentCreate = {
            fullName: appointment.patientName,
            content: values.content,
            starCount: values.star,
            doctorId: appointment.doctorId,
            dateBooking: appointment.appointmentDate.toString().split('T')[0],
        };
        console.log('new comment', data);
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
