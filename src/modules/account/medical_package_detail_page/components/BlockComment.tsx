import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import { useState, useEffect, useMemo, useRef } from 'react';
import { commentService } from '../../../../services';
import { Comment } from '../../../../models/comment';
import socket from '../../../../socket';
import { useFetchCommentsByCommentableIdAndType } from '../../../../hooks/comment';
import { configConsumerProps } from 'antd/es/config-provider';
export const BlockComment = ({ commentableId, setIsModalCommentOpen }: any) => {
    // const [comments, setComments] = useState<Comment[]>();
    const {
        data,
        error,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
    } = useFetchCommentsByCommentableIdAndType({
        pageSize: 6,
        commentableId: commentableId,
        type: 'MedicalPackage',
    });
    // ======= Infinite Scroll Logic =======
    const observerRef = useRef<HTMLDivElement | null>(null);
    const comments = useMemo(() => {
        return data?.pages.flatMap((page) => page.comments) ?? [];
    }, [data]);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [hasNextPage, isFetchingNextPage]);
    // const getCommentByUserId = async (userID: number) => {
    //     try {
    //         const data = {
    //             pageIndex: pageIndex,
    //             pageSize: pageSize,
    //             userId: Number(userID),
    //             type: 'Dịch vụ',
    //         };
    //         const comments = await commentService.getCommentByUserId(data);
    //         console.log(comments.data);
    //         setComments(comments.data);
    //     } catch (err: any) {
    //         console.log(err);
    //     }
    // };
    const handleOnNewComment = () => {
        socket?.on('newComment', (newComment: Comment) => {
            // getCommentByUserId(Number(newComment.doctorId));
        });
    };
    useEffect(() => {
        handleOnNewComment();
    });

    return (
        <>
            <h3 className="fs-4">Phản hồi của người khám</h3>
            <Skeleton active loading={isFetching || isFetchingNextPage}>
                {error ? (
                    <p className="text-center fw-bold">
                        {error.message.includes('404')
                            ? 'Không có đánh giá nào !'
                            : error.message}
                    </p>
                ) : (
                    comments &&
                    comments.map((comment: Comment) => {
                        return (
                            <div className="comment mt-4 border border-start-0 border-end-0 border-top-0">
                                <div className="d-flex">
                                    <h6 className="patient__name">
                                        {comment.fullName}
                                    </h6>
                                    <span className="appointment__date  ms-2 text-primary">
                                        <CheckCircleOutlined />
                                        <span className="ms-1">
                                            đã khám ngày
                                            {comment?.dateBooking?.slice(0, 10)}
                                        </span>
                                    </span>
                                </div>

                                <p className="comment__content mt-2">
                                    {comment.content}
                                </p>
                            </div>
                        );
                    })
                )}
            </Skeleton>
            <div
                ref={observerRef}
                // style={{ height: 20, marginBottom: 20 }}
            />
        </>
    );
};
