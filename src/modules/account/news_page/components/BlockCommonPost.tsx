import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { Post } from '../../../../models/post';
import { Image } from 'antd';
import { PostService } from '../../../../services/post.service';
import { baseURL } from '../../../../constants/api';

export const BlockCommonPost = () => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: false,
        speed: 1000,
        autoplaySpeed: 2000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const [posts, setPosts] = useState<Post[]>([]);
    const getCommonNews = async () => {
        try {
            const res = await PostService.getCommonPost();
            console.log(res);
            setPosts(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const updateViewPost = async (id: number) => {
        try {
            const res = await PostService.updateViewPost(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getCommonNews();
    }, []);
    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bài phổ biến</h3>
            </div>
            <div className="block__list mt-4 position-relative posts">
                <Slider {...settings}>
                    {posts?.length > 0 ? (
                        posts.map((post: Post) => {
                            return (
                                <div
                                    className="slide__container  col-3 ps-3 pe-3"
                                    key={post.id}
                                >
                                    <div className="item border flex-grow-1 border-1 rounded p-3 text-center   ">
                                        <Link
                                            onClick={() => {
                                                updateViewPost(post.id);
                                            }}
                                            to={'/post/detail/' + post.id}
                                            className=" text-decoration-none feature-img-container"
                                        >
                                            <Image
                                                className="item__image feature-img object-fit-cover rounded "
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
                                            <p className="post-title mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                                <Link
                                                    to={
                                                        '/post/detail/' +
                                                        post.id
                                                    }
                                                    className=" text-decoration-none text-dark"
                                                    onClick={() => {
                                                        updateViewPost(post.id);
                                                    }}
                                                >
                                                    {post.title}
                                                </Link>
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
