import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export const BlockComment = ({ setIsModalCommentOpen }: any) => {
    return (
        <>
            <h3 className="fs-4">Phản hồi của người khám</h3>
            <div className="list__comment">
                <div className="comment mt-4 border border-start-0 border-end-0 border-top-0">
                    <div className="d-flex">
                        <h6 className="patient__name">Nguyễn Hữu Thế Phong </h6>
                        <span className="appointment__date  ms-2 text-primary">
                            <CheckCircleOutlined />
                            <span className="ms-1">
                                đã khám ngày 30/07/2024
                            </span>
                        </span>
                    </div>

                    <p className="comment__content mt-2">
                        Cảm nhận App BookingCare tuyệt vời. Tôi thường xuyên sử
                        dụng BookingCare tham khảo và đặt lịch. Bác sĩ khám tốt,
                        thông tin có trước giảm thiểu việc kê khai lại thông
                        tin. Tuy nhiên, do bác sĩ đông bệnh nhân nên việc chờ
                        đợi lâu.
                    </p>
                </div>
            </div>
            <div className="group__button text-center mt-3">
                <Button
                    onClick={(e: any) => {
                        setIsModalCommentOpen(true);
                    }}
                    className="pt-3 pb-3"
                >
                    Thêm bình luận
                </Button>
            </div>
        </>
    );
};
