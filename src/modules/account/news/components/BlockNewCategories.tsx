import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { News } from '../../../../models/news';
import { Button, Image } from 'antd';
import { NewsCategory } from '../../../../models/news_categories';
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
    const [newsCategories, setNewsCategories] = useState<NewsCategory>();
    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">
                    Danh mục sống khỏe
                </h3>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item  border rounded p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item  border rounded p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image rounded-circle"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item border rounded  p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image rounded-circle"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item border rounded  p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image rounded-circle"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item border rounded p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image rounded-circle"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="slide__container  col-3 ps-3 pe-3">
                        <div className="item border rounded p-3 text-center  ">
                            <Link to="" className=" text-decoration-none">
                                <Image
                                    className="item__image rounded-circle"
                                    preview={false}
                                    src="https://cdn.bookingcare.vn/fo/w1920/2024/09/05/083305-dieu-tri-benh-tang-huyet-ap.png"
                                ></Image>
                                <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                    Khám và điều trị Tăng huyết áp ở đâu tốt tại
                                    Hà Nội?
                                </p>
                            </Link>
                        </div>
                    </div>
                </Slider>
            </div>
        </div>
    );
};
