import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { Post } from '../../../../models/post';
import { Image, Skeleton } from 'antd';
import { baseURL } from '../../../../constants/api';
import { useFetchCommonPosts } from '../../../../hooks';
import useUpdatePostViews from '../../../../hooks/posts/useUpdatePostViews';

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
    const { data, error, isFetching } = useFetchCommonPosts();
    const updateViewPost = useUpdatePostViews();

    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bài phổ biến</h3>
            </div>
            <Skeleton active loading={isFetching}>
                {error ? (
                    <p className="text-center fw-bold">{error.message}</p>
                ) : (
                    <div className="block__list mt-4 position-relative posts">
                        <Slider {...settings}>
                            {data?.length > 0 ? (
                                data.map((post: Post) => {
                                    return (
                                        <div
                                            className="slide__container  col-3 ps-3 pe-3"
                                            key={post.id}
                                        >
                                            <div className="item border flex-grow-1 border-1 rounded p-3 text-center   ">
                                                <Link
                                                    onClick={() => {
                                                        updateViewPost.mutate(
                                                            post.id
                                                        );
                                                    }}
                                                    to={
                                                        '/post/detail/' +
                                                        post.id
                                                    }
                                                    className=" text-decoration-none feature-img-container"
                                                >
                                                    <Image
                                                        className="item__image feature-img object-fit-cover rounded "
                                                        preview={false}
                                                        src={
                                                            post?.featuredImage?.includes(
                                                                'cloudinary'
                                                            )
                                                                ? post?.featuredImage
                                                                : baseURL +
                                                                  post?.featuredImage
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
                                                                updateViewPost.mutate(
                                                                    post.id
                                                                );
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
                )}
            </Skeleton>
        </div>
    );
};
