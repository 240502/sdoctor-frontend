import { Card, Flex, Image, Button } from 'antd';
import {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { Post } from '../../../../models/post';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../../stores/userAtom';

export const NewsCards = ({
    posts,
    setIsShowModal,
    setPost,
    setIsUpdate,
    setIsShowModalConfirm,
}: any) => {
    const user = useRecoilValue(userValue);

    return (
        <Flex wrap>
            {posts?.length > 0 ? (
                posts?.map((post: Post) => {
                    return (
                        <div className="col-3 ps-2 pe-2 mb-3">
                            <Card className="shadow" actions={[,]}>
                                <div className="feature-img-container text-center w-100">
                                    <Image
                                        className="rounded feature-img object-fit-cover"
                                        height={150}
                                        preview={false}
                                        src={post.featuredImage}
                                    ></Image>
                                </div>
                                <div className="author mt-3">
                                    <Flex className="align-items-center">
                                        <p className="author-name mb-0">
                                            {post.authorName}
                                        </p>
                                    </Flex>
                                </div>
                                <div className="time_public mt-2">
                                    <ClockCircleOutlined className="me-2" />
                                    {post.publicDate != null
                                        ? post.publicDate
                                              .toString()
                                              .slice(0, 10)
                                        : post.createdAt
                                              ?.toString()
                                              .slice(0, 10)}
                                </div>
                                <h6
                                    className="title mt-2"
                                    style={{
                                        height: '60px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        textAlign: 'justify',
                                    }}
                                >
                                    {post.title}
                                </h6>
                                <Flex className="justify-content-between mt-2 ">
                                    <Button
                                        className="border-0 text-success p-0"
                                        onClick={() => {
                                            setIsShowModal(true);
                                            setPost(post);
                                            setIsUpdate(true);
                                        }}
                                    >
                                        {user.roleId === 2 ? (
                                            <>
                                                <EditOutlined /> Sửa
                                            </>
                                        ) : (
                                            <>
                                                <EyeOutlined /> Xem
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        className="border-0 p-0"
                                        danger
                                        onClick={() => {
                                            setIsShowModalConfirm(true);
                                            setPost(post);
                                        }}
                                    >
                                        <DeleteOutlined /> Xóa
                                    </Button>
                                </Flex>
                            </Card>
                        </div>
                    );
                })
            ) : (
                <p className="text-center ps-2 pe-2 ">Không có bài viết nào</p>
            )}
        </Flex>
    );
};
