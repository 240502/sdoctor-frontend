import { Image, Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';
import Slider from 'react-slick';
import { Clinic } from '../../../../models';
import { baseURL } from '../../../../constants/api';
import { useFetchCommonClinic } from '../../../../hooks';
const BlockClinic = (): JSX.Element => {
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: false,
        speed: 1000,
        autoplaySpeed: 1000,
        cssEase: 'ease-in-out',
        arrow: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const { data, error, isFetching } = useFetchCommonClinic();

    return (
        <div className="block__clinic row mt-5 mb-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Cơ sở y tế</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">
                    <Link to={'/list/clinics'} className="text-decoration-none">
                        Xem thêm
                    </Link>
                </Button>
            </div>
            <Skeleton loading={isFetching}>
                <div className="block__list mt-4 position-relative">
                    {error ? (
                        <p className="fw-bold text-center">{error.message}</p>
                    ) : (
                        <Slider {...settings}>
                            {data?.map((clinic: Clinic) => {
                                return (
                                    <div
                                        className="slide-container"
                                        key={clinic.id}
                                    >
                                        <div className="item border border-1 rounded p-2 text-center  ">
                                            <Link
                                                // onClick={() =>
                                                //     // handleUpdateViewsClinic(
                                                //     //     Number(clinic.id)
                                                //     // )
                                                // }
                                                to={
                                                    '/clinic/detail/' +
                                                    clinic.id
                                                }
                                                className=" text-decoration-none"
                                            >
                                                <Image
                                                    className="item__image object-fit-contain"
                                                    preview={false}
                                                    src={
                                                        clinic.avatar.includes(
                                                            'cloudinary'
                                                        )
                                                            ? clinic.avatar
                                                            : baseURL +
                                                              clinic.avatar
                                                    }
                                                ></Image>
                                                <p
                                                    className="item__text mt-3 text-center text-decoration-none text-capitalize"
                                                    style={{ height: '30px' }}
                                                >
                                                    {clinic.name}
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    )}
                </div>
            </Skeleton>
        </div>
    );
};
export default BlockClinic;
