import { CalendarOutlined } from '@ant-design/icons';
import { Flex, Image, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { Post } from '../../../../models/post';
export const RelatedPost = ({
    relatedPosts,
    pageIndex,
    pageSize,
    pageCount,
    onChangePage,
    setPageIndex,
}: any) => {
    return (
        <>
            {' '}
            {relatedPosts.map((post: Post) => {
                return (
                    <>
                        <Flex className="align-items-center" key={post?.id}>
                            <div className="col-4 feature-img-container">
                                <Link
                                    to={'/post/detail/' + post.id}
                                    onClick={() => {
                                        if (pageIndex !== 1) {
                                            setPageIndex(1);
                                        }
                                    }}
                                >
                                    <Image
                                        className="feature-img object-fit-cover rounded"
                                        src={post.featured_image}
                                        preview={false}
                                    />
                                </Link>
                            </div>
                            <div>
                                <p className="mb-0 ms-2 fw-bold post-title">
                                    <Link
                                        onClick={() => {
                                            if (pageIndex !== 1) {
                                                setPageIndex(1);
                                            }
                                        }}
                                        to={'/post/detail/' + post.id}
                                        className="text-decoration-none text-dark"
                                    >
                                        {post.title}
                                    </Link>
                                </p>
                                <p className="ms-2">
                                    <CalendarOutlined className="me-2" />
                                    {post.public_date?.toString().slice(0, 10)}
                                </p>
                            </div>
                        </Flex>
                    </>
                );
            })}
            {pageCount > 1 && (
                <Pagination
                    showSizeChanger
                    pageSize={pageSize}
                    onChange={(current: number, size: number) =>
                        onChangePage(current, size)
                    }
                    current={pageIndex}
                    defaultCurrent={1}
                    align="center"
                    total={pageCount * pageSize}
                    pageSizeOptions={['5', '10', '20', '30']}
                />
            )}
        </>
    );
};
