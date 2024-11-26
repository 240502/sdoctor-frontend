import { Button, Image, Input, Select } from 'antd';
import { Carousel } from 'antd';
import '@/assets/scss/home.scss';
import { BlockService } from '../components/BlockService';
import { BlockForYou } from '../components/BlockForYou';
import { BlockClinic } from '../components/BlockClinic';
import { BlockHotDoctor } from '../components/BlockHotDoctor';
import { BlockCommonNews } from '../components/BlockCommonNews';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
                            Đặt lịch
                        </Button>
                        <Button
                            onClick={() => navigate('/list/doctor')}
                            className="ms-2 bg-transparent text-light"
                            variant="outlined"
                            color="default"
                        >
                            Xem bác sĩ
                        </Button>
                    </div>
                </div>

                {/* <div
                    className="container group__search position-absolute top-100 start-50  shadow-lg translate-middle z-2 bg-light bg-gradient p-3 col-6 m-auto border border-start-0 border-end-0 border-top-0"
                    style={{ width: '100%', maxHeight: '200px' }}
                >
                    <div className="group__input position-relative">
                        <Input placeholder="Tìm kiếm" className="pt-2 pb-2" />
                        <Button
                            type="primary"
                            className="position-absolute end-0 me-2  top-50  translate-middle-y"
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                    <div className="group__select mt-3 row justify-content-between">
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                showSearch
                                placeholder="Chọn tỉnh"
                                optionFilterProp="children"
                                defaultValue={'0'}
                            >
                                <Select.Option value={'0'}>
                                    Chọn tỉnh thành
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                            >
                                <Select.Option value={'0'}>
                                    Chọn danh mục
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                            >
                                <Select.Option value={'0'}>
                                    Chọn mức giá
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="group__item col">
                            <Select
                                className=""
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="children"
                                defaultValue={'0'}
                            >
                                <Select.Option value={'0'}>
                                    Chọn cơ sở y tế
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="group__item col text-end">
                            <Button></Button>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="container home__content mt-4 ">
                <BlockForYou />
                <BlockHotDoctor />
                <BlockService />
                <BlockClinic />
                <BlockCommonNews />
            </div>
        </>
    );
};
