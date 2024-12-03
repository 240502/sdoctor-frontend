import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { Post } from '../../../../models/post';
import { Button, Image } from 'antd';
import { PostService } from '../../../../services/postService';
import { baseURL } from '../../../../constants/api';
export const BlockNewPost = () => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: false,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const getNewPost = async () => {
        try {
            const res = await PostService.getNewPost();
            console.log(res);
            setPosts(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getNewPost();
    }, []);
    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bài viết mới</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">Xem thêm</Button>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    {posts?.length > 0 ? (
                        posts.map((post: Post) => {
                            return (
                                <div className="slide__container col-3 ps-3 pe-3">
                                    <div className="item border border-1 rounded p-3 text-center  ">
                                        <Link
                                            to={'/post/detail/' + post.id}
                                            className=" text-decoration-none"
                                        >
                                            <Image
                                                className="item__image object-fit-contain"
                                                preview={false}
                                                src={
                                                    post?.featured_image?.includes(
                                                        'cloudinary'
                                                    )
                                                        ? post?.featured_image
                                                        : baseURL +
                                                          post?.featured_image
                                                }
                                            ></Image>
                                            <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                                {post.title}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </Slider>
            </div>
        </div>
    );
};
