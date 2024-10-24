import { Image } from 'antd';
import { Carousel } from 'antd';
import '@/assets/scss/home.scss';
import { BlockService } from '../components/BlockService';
import { BlockForYou } from '../components/BlockForYou';
import { BlockClinic } from '../components/BlockClinic';
import { BlockHotDoctor } from '../components/BlockHotDoctor';
import { BlockCommonNews } from '../components/BlockCommonNews';

export const Home = () => {
    return (
        <div className="container home__content mt-4">
            <div className="slide__container row">
                <Carousel autoplay>
                    <Image
                        preview={false}
                        src="http://localhost:5173/img/093216-bc.jpg"
                    ></Image>
                </Carousel>
            </div>
            <BlockForYou />
            <BlockHotDoctor />
            <BlockService />
            <BlockClinic />
            <BlockCommonNews />
        </div>
    );
};
