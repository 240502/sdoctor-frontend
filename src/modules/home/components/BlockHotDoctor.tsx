import { useRef } from 'react';
import { Image, Button, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export const BlockHotDoctor = (): JSX.Element => {
    const carouselRef = useRef<any>(null);

    const next = () => {
        carouselRef.current.next();
    };

    const prev = () => {
        carouselRef.current.prev();
    };
    return (
        <div className="block__hot__doctor row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bác sĩ nổi bật</h3>
            </div>
            <div className="block__list mt-4 position-relative">
                <Carousel ref={carouselRef} autoplay autoplaySpeed={3000}>
                    <div className="slide__container">
                        <div className="block__list__item row  justify-content-between ">
                            <div className="item  m-3   p-3 ">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3  p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3   p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3   p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="slide__container">
                        <div className="block__list__item row  justify-content-between ">
                            <div className="item  m-3   p-3 ">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3  p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3   p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
                                    </p>
                                </Link>
                            </div>
                            <div className="item  m-3   p-3">
                                <Link to="" className=" text-decoration-none">
                                    <Image
                                        preview={false}
                                        className="rounded-circle"
                                        src="https://cdn.bookingcare.vn/fo/w384/2021/11/09/143035-drtranthimaithy400x400.jpg"
                                    ></Image>
                                    <p className="item__text mt-3 text-center text-decoration-none fs-5 text-capitalize">
                                        Thạc sĩ, Bác sĩ Trần Thị Mai Thy
                                        <div className="specialization fs-6 mt-1">
                                            Thần kinh
                                        </div>
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
