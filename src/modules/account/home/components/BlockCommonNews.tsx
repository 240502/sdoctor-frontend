import { Link } from 'react-router-dom';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

import { HomeDirectoryService } from '../../../../services/home_directoryService';
import { HomeDirectory } from '../../../../models/home_directory';
import { baseURL } from '../../../../constants/api';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import { News } from '../../../../models/post';
export const BlockCommonNews = () => {
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
    const [newNews, setNewNews] = useState<News>();
    const loadData = async () => {
        try {
            const data = await HomeDirectoryService.getHomeDirectory();
        } catch (err: any) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="row block__service mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bài viết nổi bật</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">Xem thêm</Button>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    <div className="slide__container col-3 ps-3 pe-3">
                        <div className="item border border-1 rounded p-3 text-center  ">
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
                    <div className="slide__container col-3 ps-3 pe-3">
                        <div className="item border border-1 rounded p-3 text-center  ">
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
                    </div>{' '}
                    <div className="slide__container col-3 ps-3 pe-3">
                        <div className="item border border-1 rounded p-3 text-center  ">
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
                    </div>{' '}
                    <div className="slide__container col-3 ps-3 pe-3">
                        <div className="item border border-1 rounded p-3 text-center  ">
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
                </Slider>
            </div>
        </div>
    );
};
