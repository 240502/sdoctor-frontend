import { Link } from 'react-router-dom';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import { Services } from '../../../../models/services';
import { ServicesService } from '../../../../services/servicesService';
import { baseURL } from '../../../../constants/api';
export const BlockService = () => {
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
    const [commonServices, setCommonServices] = useState<Services[]>();
    const loadData = async () => {
        try {
            const data = await ServicesService.getCommonService();
            console.log(data);
            setCommonServices(data);
        } catch (err: any) {
            console.error(err);
        }
    };
    const handleUpdateViewsService = async (id: number): Promise<any> => {
        try {
            const res = await ServicesService.updateViewsService(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    return (
        <div className="row block__service mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Dịch vụ nổi bật</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">Xem thêm</Button>
            </div>
            <div className="block__list mt-4 position-relative">
                <Slider {...settings}>
                    {commonServices?.map((service: Services) => {
                        return (
                            <div className="slide__container col-3 ps-3 pe-3">
                                <div className="item border border-1 rounded p-3 text-center  ">
                                    <Link
                                        onClick={() =>
                                            handleUpdateViewsService(
                                                Number(service.id)
                                            )
                                        }
                                        to={'/service/detail/' + service.id}
                                        className=" text-decoration-none"
                                    >
                                        <Image
                                            className="item__image"
                                            preview={false}
                                            style={{ width: '157px' }}
                                            src={baseURL + service.image}
                                        ></Image>
                                        <p className="item__text mt-3 text-center text-dark fw-bold fs-6 text-capitalize">
                                            {service.name}
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
