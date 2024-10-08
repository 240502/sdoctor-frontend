import { useState, useEffect } from 'react';
import { Image, Button, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { doctorService } from '../../../services/doctorService';
import { Doctor } from '../../../models/doctor';
import { baseURL } from '../../../constants/api';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { doctorListState, doctorListValue } from '../../../stores/doctorAtom';
export const BlockHotDoctor = (): JSX.Element => {
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

    const setDoctors = useSetRecoilState(doctorListState);
    const doctors = useRecoilValue(doctorListValue);

    const loadData = async () => {
        console.log('call api');
        try {
            const data = await doctorService.getCommonDoctor();
            setDoctors(data);
            console.log(data);
        } catch (err: any) {
            console.log(err.message);
            setDoctors([]);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="block__hot__doctor row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bác sĩ nổi bật</h3>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    {doctors.length > 0 ? (
                        doctors?.map((doctor: Doctor) => {
                            return (
                                <div className="slide__container">
                                    <div className="item   p-3 ">
                                        <Link
                                            to=""
                                            className="text-decoration-none text-center"
                                        >
                                            <Image
                                                preview={false}
                                                width={222}
                                                className="rounded-circle text-center"
                                                src={baseURL + doctor.image}
                                            ></Image>
                                            <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                                {doctor.full_name}
                                                <div className="specialization fs-6 mt-1">
                                                    {doctor.major_name}
                                                </div>
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Có bác sĩ nào !</p>
                    )}
                </Slider>
            </div>
        </div>
    );
};
