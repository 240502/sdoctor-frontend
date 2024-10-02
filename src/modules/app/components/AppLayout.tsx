import { HomeMenu } from './menu/HomeMenu';
import { HomeFooter } from './footer/HomeFooter';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import '@/assets/scss/app.scss';

const { Header, Content, Footer } = Layout;
export const AppLayout = ({ children }: any) => {
    return (
        <Layout>
            <Header
                className="home__header position-fixed top-0 start-0 end-0"
                style={{ zIndex: '99' }}
            >
                <div className="container d-flex justify-content-between">
                    <div className="home__header__logo">
                        <Link
                            onClick={(e) => {
                                localStorage.setItem(
                                    'currentMenu',
                                    JSON.stringify('home')
                                );
                            }}
                            className="header__logo__text fs-2 fw-bold text-decoration-none"
                            to="/"
                        >
                            SDOCTOR
                        </Link>
                    </div>
                    <HomeMenu></HomeMenu>
                </div>
            </Header>
            <Content style={{ background: '#fff', marginTop: '78px' }}>
                {children}
            </Content>
            <Footer>
                <HomeFooter />
            </Footer>
        </Layout>
    );
};
