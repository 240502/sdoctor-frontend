import { CalendarOutlined } from '@ant-design/icons';
import { Flex, Image, Pagination, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { Post } from '../../../../models/post';
import dayjs from 'dayjs';
import { useFetchRelatedPosts } from '../../../../hooks';
import { useEffect, useState } from 'react';
interface RelatedPostProps {
    postId: number;
    categoryId: number | undefined;
}
export const RelatedPost = (props: RelatedPostProps) => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const { data, error, isFetching } = useFetchRelatedPosts({
        id: props.postId,
        pageIndex: pageIndex,
        pageSize: 6,
        categoryId: props.categoryId,
    });

    return (
        <Skeleton active loading={isFetching}>
            {error ? (
                <p className="text-center fw-bold">{error.message}</p>
            ) : (
                !isFetching &&
                data?.posts?.map((post: Post) => {
                    return (
                        <>
                            <Flex className="align-items-center" key={post?.id}>
                                <div className="col-4 feature-img-container">
                                    <Link
                                        to={'/post/detail/' + post.id}
                                        // onClick={() => {
                                        //     if (pageIndex !== 1) {
                                        //         setPageIndex(1);
                                        //     }
                                        // }}
                                    >
                                        <Image
                                            className="feature-img object-fit-cover rounded"
                                            src={post.featuredImage}
                                            preview={false}
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <p className="mb-0 ms-2 fw-bold post-title">
                                        <Link
                                            // onClick={() => {
                                            //     if (pageIndex !== 1) {
                                            //         setPageIndex(1);
                                            //     }
                                            // }}
                                            to={'/post/detail/' + post.id}
                                            className="text-decoration-none text-dark"
                                        >
                                            {post.title}
                                        </Link>
                                    </p>
                                    <p className="ms-2">
                                        <CalendarOutlined className="me-2" />
                                        {dayjs(post.publicDate).format(
                                            'DD-MM-YYYY'
                                        )}
                                    </p>
                                </div>
                            </Flex>
                        </>
                    );
                })
            )}
            {data?.pageCount && (
                <Pagination
                    // showSizeChanger
                    pageSize={data?.pageSize}
                    onChange={(current: number, _: number) => {
                        setPageIndex(current);
                    }}
                    current={data?.pageIndex}
                    defaultCurrent={1}
                    align="center"
                    total={data?.totalItems}
                />
            )}
        </Skeleton>
    );
};
