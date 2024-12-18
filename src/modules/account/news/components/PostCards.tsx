import React, { useEffect } from 'react';
import { Divider, Flex, Image } from 'antd';
import { Post } from '../../../../models/post';
import { Link, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import '@/assets/scss/app.scss';
import * as cheerio from 'cheerio';
import { PostService } from '../../../../services/postService';

export const PostCards = ({ posts }: any) => {
    const navigate = useNavigate();
    const handleShowDescriptionPost = (postContent: string) => {
        const $ = cheerio.load(postContent);
        const firstContent =
            $('h4').first().text() !== ''
                ? $('h4').first().text()
                : $('p').first().text();
        return <>{firstContent}</>;
    };
    const updateViewPost = async (id: number) => {
        try {
            const res = await PostService.updateViewPost(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    return (
        <Flex className="mt-3 posts" vertical>
            {posts?.length > 0 ? (
                posts.map((post: Post) => {
                    return (
                        <>
                            <div
                                key={post.id}
                                className="mb-3  d-flex p-3 mb-3 rounded align-items-center border border-top-0 border-start-0 border-end-0"
                                style={{
                                    maxHeight: '100px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div className="img col-1 ">
                                    <Image
                                        onClick={() => {
                                            navigate('/post/detail/' + post.id);
                                            updateViewPost(post.id);
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        src={post.featured_image}
                                        preview={false}
                                        className="rounded"
                                    />
                                </div>
                                <h6 className="col-9 ms-3">
                                    <Link
                                        style={{
                                            textAlign: 'justify',
                                            maxWidth: '100%',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                        }}
                                        to={'/post/detail/' + post.id}
                                        onClick={() => {
                                            updateViewPost(post.id);
                                        }}
                                        className="text-decoration-none text-dark d-inline-block"
                                    >
                                        {post.title}
                                    </Link>
                                    <p
                                        onClick={() => {
                                            navigate('/post/detail/' + post.id);
                                            updateViewPost(post.id);
                                        }}
                                        className="w-full post-content fw-normal m-0"
                                        style={{
                                            cursor: 'pointer',
                                            maxWidth: '100%',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {handleShowDescriptionPost(
                                            post.content
                                        )}
                                    </p>
                                </h6>
                            </div>
                        </>
                    );
                })
            ) : (
                <p className="text-center">Không có bài viết nào</p>
            )}
        </Flex>
    );
};
