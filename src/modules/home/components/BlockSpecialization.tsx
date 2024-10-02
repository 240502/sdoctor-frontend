import { useEffect, useState } from 'react';
import { Image, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Major } from '../../../models/major';
import { MajorService } from '../../../services/majorService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { baseURL } from '../../../constants/api';

export const BlockSpecialization = (): JSX.Element => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const [majors, setMajors] = useState<Major[]>();
    const loadData = async () => {
        try {
            const data = await MajorService.getCommonMajor();
            setMajors(data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="block__specialization row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">
                    Chuyên khoa phổ biến
                </h3>
                <Button className="btn__more pt-3 pb-3 fs-5">Xem thêm</Button>
            </div>
            <div className="block__list mt-4 position-relative p-0 text-center">
                <Slider {...settings}>
                    {majors?.map((major: Major) => {
                        return (
                            <div className="slide__container">
                                <div className="item  border border-1 rounded p-3  ">
                                    <Link
                                        to=""
                                        className=" text-decoration-none"
                                    >
                                        <Image
                                            preview={false}
                                            src={baseURL + major.image}
                                        ></Image>
                                        <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                            {major.name}
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
