import { HomeMenu } from './menu/HomeMenu';
import { HomeFooter } from './footer/HomeFooter';
import { Button, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, AuditOutlined } from '@ant-design/icons';
import '@/assets/scss/app.scss';

const { Header, Content, Footer } = Layout;
export const AppLayout = ({ children }: any) => {
    const navigate = useNavigate();
    return (
        <Layout>
            <Header
                className="home__header position-fixed top-0 start-0 end-0"
                style={{ zIndex: '99' }}
            >
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="home__header__logo">
                        <Link
                            className="header__logo__text fs-2 fw-bold text-decoration-none"
                            to="/"
                        >
                            SDOCTOR
                        </Link>
                    </div>
                    <HomeMenu></HomeMenu>
                    <div className="group__button__header d-flex">
                        <Button
                            className="border-0"
                            onClick={() => navigate('/patient/profile')}
                        >
                            <UserOutlined />
                            Hồ sơ
                        </Button>

                        <Button
                            className="border-0"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                    </div>
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
