import { Button, Input, InputRef, Modal, DatePicker } from 'antd';
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

export const ModalComment = ({
    openNotificationWithIcon,
    serviceId,
    isModalCommentOpen,
    setIsModalCommentOpen,
}: any): JSX.Element => {
    const inputPatientNameRef = useRef<InputRef>(null);
    const inputPatientPhoneRef = useRef<InputRef>(null);
    const inputDateBookingRef = useRef<InputRef>(null);
    const inputContentRef = useRef<any>(null);
    const datePickerRef = useRef<any>(null);

    const [date, setDate] = useState<string>();

    const handleCancel = () => {
        setIsModalCommentOpen(false);
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(String(dateString));
        console.log(datePickerRef.current.nativeElement);
    };
    const handleOk = () => {
        const isEmptyName = isEmpty(inputPatientNameRef?.current?.input);
        const isEmptyPhone = isEmpty(inputPatientPhoneRef?.current?.input);
        const isEmptyContent = isEmpty(
            inputContentRef?.current?.resizableTextArea?.textArea
        );
        const isEmptyDateBooking = isEmptyDatePicker(
            datePickerRef.current.nativeElement,
            date
        );
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
                datePickerRef.current.nativeElement,
                date
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
                const data: Comment = {
                    id: 0,
                    full_name: inputPatientNameRef?.current?.input?.value ?? '',
                    phone: inputPatientPhoneRef?.current?.input?.value ?? '',
                    date_booking: date,
                    content:
                        inputContentRef?.current?.resizableTextArea?.textArea
                            .value ?? '',
                    user_id: Number(serviceId),
                    type: 'Dịch vụ',
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
                <DatePicker
                    onFocus={() => handleFocusSelect(datePickerRef.current)}
                    ref={datePickerRef}
                    className="mb-3 d-block"
                    defaultChecked={true}
                    onChange={onChange}
                ></DatePicker>
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
