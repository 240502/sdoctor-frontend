import { Button, Input, InputRef, Modal } from 'antd';
import { useRef } from 'react';
import {
    handleFocusInput,
    isEmpty,
    validateName,
    validatePhone,
    validatePhoneLength,
} from '../../../utils/global';
import { validateDateBooking } from '../../../utils/comment';
import { CommentService } from '../../../services/commentService';
import { Comment } from '../../../models/comment';
import socket from '../../../socket';
const { TextArea } = Input;

export const ModalComment = ({
    openNotificationWithIcon,
    doctorId,
    isModalCommentOpen,
    setIsModalCommentOpen,
}: any): JSX.Element => {
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputDateBookingRef = useRef<InputRef>(null);
    const inputContentRef = useRef<any>(null);
    const handleCancel = () => {
        setIsModalCommentOpen(false);
    };
    const handleOk = () => {
        const isEmptyName = isEmpty(inputPatientNameRef?.current?.input);
        const isEmptyPhone = isEmpty(inputPatientPhoneRef?.current?.input);
        const isEmptyContent = isEmpty(
            inputContentRef?.current?.resizableTextArea?.textArea
        );
        const isEmptyDateBooking = isEmpty(inputDateBookingRef?.current?.input);
        if (
            !isEmptyPhone &&
            !isEmptyContent &&
            !isEmptyDateBooking &&
            !isEmptyName
        ) {
            const isErrorName = validateName(
                inputPatientNameRef?.current?.input
            );
            const isErrorPhone = validatePhone(
                inputPatientPhoneRef.current?.input
            );
            const isErrorDateBooking = validateDateBooking(
                inputDateBookingRef.current?.input
            );
            const isErrorPhoneLength = validatePhoneLength(
                inputPatientPhoneRef.current?.input
            );
            if (
                !isErrorName &&
                !isErrorPhone &&
                !isErrorDateBooking &&
                !isErrorPhoneLength
            ) {
                const date = new Date(
                    inputDateBookingRef?.current?.input?.value ?? ''
                );

                const data: Comment = {
                    id: 0,
                    full_name: inputPatientNameRef?.current?.input?.value ?? '',
                    phone: inputPatientPhoneRef?.current?.input?.value ?? '',
                    date_booking: `${date.getFullYear()}/${
                        date.getMonth() + 1
                    }/${date.getDate()}`,
                    content:
                        inputContentRef?.current?.resizableTextArea?.textArea
                            .value ?? '',
                    user_id: Number(doctorId),
                };
                createCommentForPatient(data);
            }
        }
    };
    const createCommentForPatient = async (newComment: Comment) => {
        try {
            const res = await CommentService.createCommentForPatient(
                newComment
            );
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

    return (
        <Modal
            onCancel={handleCancel}
            open={isModalCommentOpen}
            maskClosable={false}
            title={<h3 className="fs-5">Thêm bình luận</h3>}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                    Bình luận
                </Button>,
                <Button key="back" onClick={handleCancel}>
                    Đóng
                </Button>,
            ]}
        >
            <div className="form-group mb-3 ">
                <label htmlFor="" className="form-label">
                    Họ và tên:
                </label>
                <Input
                    ref={inputPatientNameRef}
                    onFocus={() =>
                        handleFocusInput(inputPatientNameRef.current?.input)
                    }
                    className="patient__name p-2"
                />
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
            <div className="form-group mb-3 ">
                <label htmlFor="" className="form-label">
                    Số điện thoại:
                </label>
                <Input
                    onFocus={() =>
                        handleFocusInput(inputPatientPhoneRef.current?.input)
                    }
                    ref={inputPatientPhoneRef}
                    className="patient__phone p-2"
                />
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
            <div className="form-group mb-3 ">
                <label htmlFor="" className="form-label">
                    Ngày khám:
                </label>
                <Input
                    onFocus={() =>
                        handleFocusInput(inputDateBookingRef.current?.input)
                    }
                    ref={inputDateBookingRef}
                    type="date"
                    className="patient__name p-2"
                />
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
            <div className="form-group mb-3">
                <label htmlFor="">Nội dung</label>
                <TextArea
                    onFocus={() =>
                        handleFocusInput(
                            inputContentRef?.current?.resizableTextArea
                                ?.textArea
                        )
                    }
                    ref={inputContentRef}
                    rows={4}
                />
                <div
                    className="error_message mt-3"
                    style={{ color: 'red' }}
                ></div>
            </div>
        </Modal>
    );
};
