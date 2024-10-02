import { useState, useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Image } from 'antd';
import { Link } from 'react-router-dom';
import '@/assets/scss/doctor_for_you.scss';
import { useLocation } from 'react-router-dom';
const ViewForYou = () => {
    const location = useLocation();
    const [heading, setHeading] = useState('');
    useEffect(() => {
        const handleTitleView = () => {
            if (location.pathname.includes('doctor')) {
                setHeading('Bác sĩ dành cho bạn');
            }
            if (location.pathname.includes('clinic')) {
                setHeading('Cơ sở y tế dành cho bạn');
            }
            if (location.pathname.includes('major')) {
                setHeading('Chuyên khoa dành cho bạn');
            }
        };
        handleTitleView();
    }, []);

    return (
        <div className="container home__content mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `${heading}`,
                    },
                ]}
            />
            <div className="block__list__doctor">
                <h3 className="block__heading fs-5 fw-bold mt-4 mb-4">
                    Bác sĩ dành cho bạn
                </h3>
                <ul className="list__doctor m-0 p-0 list-group">
                    <li className="list-group-item mb-2">
                        <Link to="" className="text-decoration-none">
                            <Image
                                src="https://cdn.bookingcare.vn/fo/w256/2023/03/08/103031-bsi-van-tuan-nhiet-doi.png"
                                preview={false}
                                width={105}
                            ></Image>
                            <span className="doctor__name ms-3 fs-5">
                                Nguyễn Văn Tuấn
                            </span>
                        </Link>
                    </li>
                    <li className="list-group-item mb-2">
                        <Link to="" className="text-decoration-none">
                            <Image
                                src="https://cdn.bookingcare.vn/fo/w256/2023/03/08/103031-bsi-van-tuan-nhiet-doi.png"
                                preview={false}
                                width={105}
                            ></Image>
                            <span className="doctor__name ms-3 fs-5">
                                Nguyễn Văn Tuấn
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};
export default ViewForYou;
