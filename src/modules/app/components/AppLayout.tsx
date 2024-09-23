import React from 'react';
import { HomeMenu } from './menu/HomeMenu';
import { HomeFooter } from './footer/HomeFooter';
import { Flex, Layout, Input, Button } from 'antd';
import { Image } from 'antd';
import type { GetProps } from 'antd';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
export const AppLayout = ({ children }: any) => {
    const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
        console.log(info?.source, value);
    return (
        <Layout>
            <Header className="home__header">
                <div className="home__header_logo">
                    <h3>SDOCTOR</h3>
                </div>
                <HomeMenu></HomeMenu>
            </Header>
            <Content style={{ padding: '0 48px', marginTop: '24px' }}>
                <div
                    style={{
                        background: '#CCC',
                        minHeight: 280,
                        padding: 24,
                        borderRadius: '15px',
                    }}
                >
                    Content
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};
