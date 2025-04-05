import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { Image, Skeleton } from 'antd';
import { PostCategory } from '../../../../models/post_category';
import { baseURL } from '../../../../constants/api';
import { useSetRecoilState } from 'recoil';
import { postCategoryState } from '../../../../stores/scheduleAtom';
import { useFetchAllPostCategories } from '../../../../hooks';
export const BlockNewCategories = () => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 6,
        autoplay: false,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const { data, error, isFetching } = useFetchAllPostCategories();
    const setPostCategory = useSetRecoilState(postCategoryState);

    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">
                    Danh mục sống khỏe
                </h3>
            </div>
            <Skeleton active loading={isFetching}>
                {error ? (
                    <div className="text-danger text-center">
                        {error.message}
                    </div>
                ) : (
                    <div className="block__list mt-4 position-relative">
                        <Slider {...settings}>
                            {data?.map((item: PostCategory) => {
                                return (
                                    <div
                                        className="slide__container col-3 ps-3 pe-3"
                                        key={item.postCategoryId}
                                    >
                                        <div className="item  border rounded p-3 text-center  ">
                                            <Link
                                                to={'/list/post/category'}
                                                className="text-decoration-none"
                                            >
                                                <Image
                                                    className="item__image rounded-circle"
                                                    preview={false}
                                                    src={baseURL + item.image}
                                                    onClick={() => {
                                                        setPostCategory(item);
                                                    }}
                                                ></Image>
                                                <p
                                                    className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize"
                                                    onClick={() => {
                                                        setPostCategory(item);
                                                    }}
                                                >
                                                    {item.name}
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                )}
            </Skeleton>
        </div>
    );
};
