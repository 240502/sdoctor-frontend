import { Button, Image, Input, Select } from 'antd';
import { Carousel } from 'antd';
import '@/assets/scss/home.scss';
import { BlockService } from '../components/BlockService';
import { BlockCategories } from '../components/BlockCategories';
import { BlockClinic } from '../components/BlockClinic';
import { BlockHotDoctor } from '../components/BlockHotDoctor';
import { BlockCommonNews } from '../components/BlockCommonNews';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockSearchDoctor } from '../components/BlockSearchDoctor';

export const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    return (
        <>
            <div className="slide__container  position-relative">
                <Carousel autoplay arrows={false} dots={false}>
                    <Image
                        preview={false}
                        src="http://localhost:5173/img/093216-bc.jpg"
                    ></Image>
                </Carousel>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50"></div>
                <div
                    className="title position-absolute  z-2 "
                    style={{
                        left: '10%',
                        top: '40%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <h3 className=" text-light text-start">
                        Tham Khảo Ý Kiến Bác Sĩ Tốt Nhất Của Bạn
                    </h3>
                    <h3 className=" text-light"> Vị Trí Gần Bạn Nhất.</h3>
                    <p className="text-light">
                        Bắt tay vào hành trình chữa bệnh của bạn với SDOCTOR
                    </p>
                    <div className="group__button">
                        <Button
                            onClick={() => navigate('/list/doctor')}
                            color="primary"
                            variant="solid"
                            className="p-6 text-light "
                        >
                            Đặt lịch ngay
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container home__content mt-4 ">
                <BlockSearchDoctor />
                <BlockCategories />
                <BlockHotDoctor />
                <BlockService />
                <BlockClinic />
                <BlockCommonNews />
            </div>
        </>
    );
};
