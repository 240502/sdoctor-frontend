import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { useState, useEffect } from 'react';
import { CommentService } from '../../../../services/commentService';
import { Comment } from '../../../../models/comment';
import socket from '../../../../socket';
type NotificationType = 'success' | 'error';
export const BlockComment = ({ userId, setIsModalCommentOpen }: any) => {
    const [comments, setComments] = useState<Comment[]>();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [api, contextHolder] = notification.useNotification();
    const getCommentByUserId = async (userID: number) => {
        try {
            const data = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                userId: Number(userID),
                type: 'Bác sĩ',
            };
            const comments = await CommentService.getCommentByUserId(data);
            console.log(comments.data);
            setComments(comments.data);
        } catch (err: any) {
            console.log(err);
        }
    };
    const handleOnNewComment = () => {
        socket.on('newComment', (newComment: Comment) => {
            getCommentByUserId(Number(newComment.doctor_id));
        });
    };
    useEffect(() => {
        handleOnNewComment();
    });
    useEffect(() => {
        getCommentByUserId(userId);
    }, [userId, pageIndex, pageSize]);
    return (
        <>
            <h3 className="fs-4">Phản hồi của người khám</h3>
            <div className="list__comment">
                {comments ? (
                    comments.map((comment: Comment) => {
                        return (
                            <div className="comment mt-4 border border-start-0 border-end-0 border-top-0">
                                <div className="d-flex">
                                    <h6 className="patient__name">
                                        {comment.full_name}
                                    </h6>
                                    <span className="appointment__date  ms-2 text-primary">
                                        <CheckCircleOutlined />
                                        <span className="ms-1">
                                            đã khám ngày{' '}
                                            {comment?.date_booking?.slice(
                                                0,
                                                10
                                            )}
                                        </span>
                                    </span>
                                </div>

                                <p className="comment__content mt-2">
                                    {comment.content}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="fs-6 fw-bold">Không có phản hồi nào!</p>
                )}
            </div>
        </>
    );
};
