import { CheckCircleOutlined } from '@ant-design/icons';
import { Comment } from '../../../../models/comment';
import { Col, Row, Rate, Button, Skeleton } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { useFetchCommentsByCommentableIdAndType } from '../../../../hooks/comment';
export const BlockComment = ({ doctorId }: { doctorId: number }) => {
    const {
        data,
        error,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
    } = useFetchCommentsByCommentableIdAndType({
        pageSize: 6,
        commentableId: doctorId,
        type: 'Doctor',
    });
    const comments = useMemo(() => {
        return data?.pages.flatMap((page) => page.comments) ?? [];
    }, [data]);
    // ======= Infinite Scroll Logic =======
    const observerRef = useRef<HTMLDivElement | null>(null);
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
    return (
        <>
            <h6 className="fs-5 mb-3">
                {data?.pages[0].totalItems ?? 0} Đánh Giá
            </h6>
            <Skeleton active loading={isFetching || isFetchingNextPage}>
                <div className="list__comment">
                    {error ? (
                        <p className="text-center fw-bold">
                            {error.message.includes('404')
                                ? 'Không có đánh giá nào!'
                                : error.message}
                        </p>
                    ) : (
                        comments?.map((comment: Comment) => {
                            return (
                                <Row
                                    gutter={24}
                                    className="comment mt-4 border border-start-0 border-end-0 border-top-0"
                                >
                                    <Col span={16} className="">
                                        <div className="d-flex">
                                            <h6 className="patient__name">
                                                {comment.fullName}
                                            </h6>
                                            <span className="appointment__date  ms-2 text-primary">
                                                <CheckCircleOutlined />
                                                <span className="ms-1">
                                                    đã khám ngày{' '}
                                                    {comment?.dateBooking?.slice(
                                                        0,
                                                        10
                                                    )}
                                                </span>
                                            </span>
                                        </div>

                                        <p className="comment__content mt-2">
                                            {comment.content}
                                        </p>
                                    </Col>
                                    <Col span={8} className="text-end">
                                        <Rate
                                            allowHalf
                                            className="fs-6"
                                            disabled={true}
                                            value={comment.starCount}
                                        />
                                    </Col>
                                </Row>
                            );
                        })
                    )}
                </div>
                <div
                    ref={observerRef}
                    // style={{ height: 20, marginBottom: 20 }}
                />
            </Skeleton>
        </>
    );
};
