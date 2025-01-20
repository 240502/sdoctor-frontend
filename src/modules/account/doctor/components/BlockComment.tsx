import { CheckCircleOutlined } from '@ant-design/icons';
import { Comment } from '../../../../models/comment';
import { Col, Row, Rate, Button } from 'antd';
import { useEffect } from 'react';
export const BlockComment = ({
    comments,
    totalItems,
    onButtonMoreClick,
    pageCount,
    pageIndex,
}: {
    comments: Comment[] | undefined;
    totalItems: number;
    onButtonMoreClick: any;
    pageCount: number;
    pageIndex: number;
}) => {
    useEffect(() => {
        console.log('pageIndex: ', pageIndex);
        console.log('pageCount: ', pageCount);
    }, [pageCount, pageIndex]);
    return (
        <>
            <h6 className="fs-5 mb-3">{totalItems} Đánh Giá</h6>
            {totalItems > 0 ? (
                <div className="list__comment">
                    {comments ? (
                        comments.map((comment: Comment) => {
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
                    ) : (
                        <p className="fs-6 fw-bold">Không có phản hồi nào!</p>
                    )}
                    {pageCount !== pageIndex && (
                        <Button
                            className="border-0 fw-bold ps-0 pe-0"
                            style={{
                                color: 'rgb(43, 98, 205)',
                                fontSize: '16px',
                            }}
                            onClick={() => {
                                onButtonMoreClick();
                            }}
                        >
                            Xem thêm đánh giá{' '}
                        </Button>
                    )}
                </div>
            ) : (
                <>Không có đánh giá nào</>
            )}
        </>
    );
};
