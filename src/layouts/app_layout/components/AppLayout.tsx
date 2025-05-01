import { HomeMenu } from './menu/HomeMenu';
import { HomeFooter } from './footer/HomeFooter';
import { Button, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import '@/assets/scss/app.scss';
import { useRecoilValue } from 'recoil';
import { userValue } from '../../../stores/userAtom';

const { Header, Content, Footer } = Layout;
export const AppLayout = ({ children }: any) => {
    const navigate = useNavigate();
    const user = useRecoilValue(userValue);
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
                            onClick={() => {
                                user?.userId
                                    ? navigate('/admin/dashboard')
                                    : navigate('/login');
                            }}
                        >
                            {user?.userId ? 'Dashboard' : 'Đăng nhập'}
                        </Button>
                    </div>
                </div>
            </Header>
            <Content className="bg-body">
                <div className="container">{children}</div>
            </Content>
            <Footer>
                <HomeFooter />
            </Footer>
        </Layout>
    );
};
