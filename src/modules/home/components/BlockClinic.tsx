import { useRef } from 'react';
import { Image, Button, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
export const BlockClinic = (): JSX.Element => {
    const carouselRef = useRef<any>(null);

    const next = () => {
        carouselRef.current.next();
    };

    const prev = () => {
        carouselRef.current.prev();
    };
    return (
        <div className="block__specialization row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Cơ sở y tế</h3>
                <Button className="btn__more pt-3 pb-3 fs-5">Xem thêm</Button>
            </div>
            <div className="block__list mt-4 position-relative">
                <Carousel ref={carouselRef} autoplay autoplaySpeed={3000}>
                    <div className="slide__container">
                        <div className="block__list__item row justify-content-between ">
                            <div className="item border m-3 border-1 rounded p-3  ">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                            <div className="item border m-3 border-1 rounded p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                            <div className="item border m-3 border-1 rounded p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="slide__container">
                        <div className="block__list__item row justify-content-between overflow-hidden">
                            <div className="item border m-3 border-1 rounded p-3 ">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                            <div className="item border m-3 border-1 rounded p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                            <div className="item border m-3 border-1 rounded p-3 overflow-hidden">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        src="https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Cơ xương khớp
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Carousel>
                <Button
                    icon={<LeftOutlined />}
                    onClick={prev}
                    variant="outlined"
                    className="carousel-arrow left-arrow"
                />

                {/* Nút mũi tên phải */}
                <Button
                    icon={<RightOutlined />}
                    onClick={next}
                    variant="outlined"
                    className="carousel-arrow right-arrow"
                />
            </div>
        </div>
    );
};
