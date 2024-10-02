import { useState, useEffect } from 'react';
import {
    HomeOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import '@/assets/scss/doctor.scss';

const ViewDoctor = () => {
    const dateFormat = 'YYYY-MM-DD';
    const today = new Date();
    const stringDay = `${today.getFullYear()}-${today.getMonth() + 1}-${
        today.getDate().toString().length === 1
            ? '0' + today.getDate()
            : today.getDate()
    }`;
    console.log(stringDay);
    return (
        <div className="container home__content mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Bác sĩ nổi bật`,
                    },
                ]}
            />
            <h3 className="block__heading fs-5 fw-bold mt-4 mb-4">
                Bác sĩ nổi bật
            </h3>
            <div className="block__list__doctor">
                <div className="list__doctor m-0 p-0 ">
                    <div className="list__item mb-3 p-3 border rounded">
                        <div className="item_container d-flex pt-1">
                            <div className="item__left col-6 d-flex border border-start-0 border-bottom-0 border-top-0">
                                <div className="col-3 text-center">
                                    <Link to="">
                                        <Image
                                            preview={false}
                                            style={{ width: '50%' }}
                                            className="doctor__image rounded-circle"
                                            src="https://cdn.bookingcare.vn/fo/w256/2023/03/08/103031-bsi-van-tuan-nhiet-doi.png"
                                        ></Image>
                                    </Link>

                                    <Link
                                        to=""
                                        className="btn__more text-decoration-none mt-3"
                                    >
                                        Xem thêm
                                    </Link>
                                </div>
                                <div className="col-9 doctor_info">
                                    <h3 className="doctor__name fs-5">
                                        <Link
                                            to=""
                                            className="text-decoration-none"
                                        >
                                            Lê Quốc Việt
                                        </Link>
                                    </h3>
                                    <span className="doctor__des">
                                        <p className="mb-1">
                                            Hơn 30 năm kinh nghiệm khám và điều
                                            trị các bệnh nội cơ xương khớp và 40
                                            năm kinh nghiệm khám Nội tổng quát
                                        </p>
                                        <p className="mb-1">
                                            Nguyên Phó Giám đốc Bệnh viện E
                                        </p>
                                        <p className="mb-1">
                                            {' '}
                                            Bác sĩ nhận khám bệnh nhân từ 4 tuổi
                                            trở lên
                                        </p>
                                        <p>
                                            <EnvironmentOutlined className="fs-6 " />
                                            Hà Nội
                                        </p>
                                    </span>
                                </div>
                            </div>
                            <div className="item__right col-6 ps-3">
                                <div className="block__schedule border border-end-0 border-start-0 border-top-0">
                                    <DatePicker
                                        className="mb-3"
                                        defaultValue={dayjs(
                                            stringDay,
                                            dateFormat
                                        )}
                                        defaultChecked={true}
                                    ></DatePicker>
                                    <p className="fs-6 fw-bold ms-1">
                                        <CalendarOutlined /> Lịch khám
                                    </p>
                                    <span className="list__time">
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                        <Button className="me-3 mb-3">
                                            16:30 - 17:00
                                        </Button>
                                    </span>
                                    <p className="ms-1">
                                        Chọn và đặt (Phí đặt lịch 0đ)
                                    </p>
                                </div>
                                <div className="block__clinic__info mt-3 border border-end-0 border-start-0 border-top-0">
                                    <h6 className="opacity-75">
                                        Địa chỉ phòng khám
                                    </h6>
                                    <h6 className="clinic__name">
                                        Phòng khám đa khoa Mediplus
                                    </h6>
                                    <p className="clinic__location fs-6">
                                        Tầng 2, Trung tâm thương mại Mandarin
                                        Garden 2, 99 phố Tân Mai, Tân Mai, Hoàng
                                        Mai, Hà Nội
                                    </p>
                                </div>
                                <div className="fee mt-3">
                                    <span className="opacity-75 fs-6 fw-bold">
                                        Giá khám:
                                    </span>
                                    <span className="price fs-6 ms-2">
                                        999.000 đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ViewDoctor;
