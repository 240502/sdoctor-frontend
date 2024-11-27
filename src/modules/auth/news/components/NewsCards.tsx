import { Card, Flex, Image, Button } from 'antd';
import React from 'react';
import {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { News } from '../../../../models/news';

export const NewsCards = ({
    posts,
    setIsShowModal,
    setPost,
    setIsUpdate,
    setIsShowModalConfirm,
}: any) => {
    return (
        <Flex wrap>
            {posts.map((post: News) => {
                return (
                    <div className="col-3 ps-2 pe-2 mb-3">
                        <Card className="shadow" actions={[,]}>
                            <div className="feature-img-container">
                                <Image
                                    className="rounded feature-img object-fit-cover"
                                    height={150}
                                    preview={false}
                                    src={post.featured_image}
                                ></Image>
                            </div>
                            <div className="author mt-3">
                                <Flex className="align-items-center">
                                    <p className="author-name mb-0">
                                        {post.author_name}
                                    </p>
                                </Flex>
                            </div>
                            <div className="time_public mt-2">
                                <ClockCircleOutlined className="me-2" />
                                {post.public_date != null
                                    ? post.public_date.toString().slice(0, 10)
                                    : post.created_at?.toString().slice(0, 10)}
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
                                    <EditOutlined /> Sửa
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
            })}
        </Flex>
    );
};
