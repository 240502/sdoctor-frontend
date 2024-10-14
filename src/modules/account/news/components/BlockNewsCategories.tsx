import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { News } from '../../../../models/news';
import { Button, Image } from 'antd';
import { NewsCategory } from '../../../../models/news_categories';
import { CategoryServicesService } from '../../../../services/category_servicesService';
import { PostCategoryService } from '../../../../services/post_categorySerivce';
import { baseURL } from '../../../../constants/api';
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
    const [newsCategories, setNewsCategories] = useState<NewsCategory[]>();
    const loadData = async () => {
        try {
            const res = await PostCategoryService.getAllPostCategory();
            console.log(res);
            setNewsCategories(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">
                    Danh mục sống khỏe
                </h3>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    {newsCategories?.map((item: NewsCategory) => {
                        return (
                            <div className="slide__container  col-3 ps-3 pe-3">
                                <div className="item  border rounded p-3 text-center  ">
                                    <Link
                                        to=""
                                        className=" text-decoration-none"
                                    >
                                        <Image
                                            className="item__image rounded-circle"
                                            preview={false}
                                            src={baseURL + item.image}
                                        ></Image>
                                        <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                            {item.name}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};
