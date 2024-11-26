import { useState, useEffect } from 'react';
import { Image, Button, Carousel, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorListValue,
} from '../../../../stores/doctorAtom';
export const BlockHotDoctor = (): JSX.Element => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 2000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const navigate = useNavigate();

    const setDoctors = useSetRecoilState(doctorListState);
    const doctors = useRecoilValue(doctorListValue);
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
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
                                    <div className="item  p-3 ">
                                        <Card
                                            className="shadow"
                                            cover={
                                                <img
                                                    onClick={() => {
                                                        navigate(
                                                            '/doctor/detail/' +
                                                                doctor.id
                                                        );
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    alt="example"
                                                    src={baseURL + doctor.image}
                                                />
                                            }
                                            actions={[
                                                <Button>
                                                    <Link
                                                        onClick={() =>
                                                            handleUpdateViewsDoctor(
                                                                Number(
                                                                    doctor.id
                                                                )
                                                            )
                                                        }
                                                        to={
                                                            '/doctor/detail/' +
                                                            doctor.id
                                                        }
                                                        className="w-100 text-dark text-decoration-none"
                                                    >
                                                        Xem chi tiết
                                                    </Link>
                                                </Button>,
                                            ]}
                                        >
                                            <p>{doctor.title}</p>
                                            <h6>
                                                <Link
                                                    className="text-decoration-none text-dark"
                                                    to={
                                                        '/doctor/detail/' +
                                                        doctor.id
                                                    }
                                                >
                                                    {doctor.full_name}
                                                </Link>
                                            </h6>
                                            <div
                                                className="specialization mt-1 text-secondary"
                                                style={{ fontSize: '12px' }}
                                            >
                                                {doctor.major_name}
                                            </div>
                                        </Card>
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
