import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
export const HomeFooter = () => {
    return (
        <div className="container mx-5">
            <div className="row mx-5 justify-content-between">
                <div className="col-4">
                    <h3 className="fw-bold fs-6 mt-3">
                        Công ty Cổ phần Công nghệ BookingCare{' '}
                    </h3>
                    <p className="">
                        Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng
                        Hậu, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam
                    </p>
                    <p>
                        ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
                    </p>
                    <p>024-7301-2468 (7h - 18h)</p>
                    <p>support@bookingcare.vn (7h - 18h)</p>
                    <h3 className="fs-6 fw-bold">
                        Văn phòng tại TP Hồ Chí Minh
                    </h3>
                    <p>Tòa nhà H3, 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM</p>
                </div>
                <div className="col-3">
                    <div className="footer__logo">
                        <div className="home__header__logo text-start mb-2 ">
                            <Link
                                onClick={(e) => {
                                    localStorage.setItem(
                                        'currentMenu',
                                        JSON.stringify('home')
                                    );
                                }}
                                className="fs-2 fw-bold text-decoration-none"
                                to="/"
                            >
                                SDOCTOR
                            </Link>
                        </div>
                    </div>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Liên hệ hợp tác
                        </Link>
                    </p>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Chính sách bảo mật
                        </Link>
                    </p>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Quy chế hoạt động
                        </Link>
                    </p>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Tuyển dụng
                        </Link>
                    </p>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Điều khoản sử dụng
                        </Link>
                    </p>
                    <p>
                        <Link to="" className="text-decoration-none">
                            Câu hỏi thường gặp
                        </Link>
                    </p>
                </div>
                <div className="col-4">
                    <h3 className="fw-bold fs-6 mt-3">
                        Đối tác bảo trợ nội dung
                    </h3>
                    <div className="d-flex align-items-center">
                        <Image
                            width={64}
                            className="col-2"
                            src="https://cdn.bookingcare.vn/fo/w128/2023/09/08/093706-hellodoctorlogo.png"
                        ></Image>
                        <span className="col-8 ms-3">
                            <h5 className="fw-bold  fs-6">Hello Doctor</h5>
                            <p>
                                Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"
                            </p>
                        </span>
                    </div>
                    <div className="d-flex align-items-center">
                        <Image
                            width={64}
                            className="col-2"
                            src="https://cdn.bookingcare.vn/fo/w128/2023/09/08/093706-hellodoctorlogo.png"
                        ></Image>
                        <span className="col-8 ms-3">
                            <h5 className="fw-bold  fs-6">Hello Doctor</h5>
                            <p>
                                Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"
                            </p>
                        </span>
                    </div>
                    <div className="d-flex align-items-center">
                        <Image
                            width={64}
                            className="col-2"
                            src="https://cdn.bookingcare.vn/fo/w128/2023/09/08/093706-hellodoctorlogo.png"
                        ></Image>
                        <span className="col-8 ms-3">
                            <h5 className="fw-bold  fs-6">Hello Doctor</h5>
                            <p>
                                Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"
                            </p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
