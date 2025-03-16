import { Button, Image, Skeleton } from 'antd';
import { Carousel } from 'antd';
import '@/assets/scss/home.scss';
import { BlockCategories } from '../components/BlockCategories';
import { BlockClinic } from '../components/BlockClinic';
import { BlockHotDoctor } from '../components/BlockHotDoctor';
import { BlockCommonPost } from '../components/BlockCommonNews';
import { useEffect, useState } from 'react';
import { BlockSearchDoctor } from '../components/BlockSearchDoctor';
import { BlockCommonService } from '../components/BlockCommonService';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [loadingBanner, setLoadingBanner] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            setLoadingBanner(false);
        }, 1000);
    }, []);
    return (
        <>
            <div className="slide__container  position-relative">
                <Skeleton active loading={loadingBanner}>
                    <Carousel autoplay arrows={false} dots={false}>
                        <Image
                            preview={false}
                            src="http://localhost:5173/img/093216-bc.jpg"
                        ></Image>
                    </Carousel>
                </Skeleton>

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
                <BlockCommonService />
                <BlockCommonPost />
                <BlockClinic />
            </div>
        </>
    );
};
export default Home;
