import { Card, Col, Row } from 'antd';
import React from 'react';
import { Service } from '../../../../models/service';

export const ServiceCard = ({
    pageIndex,
    pageSize,
    pageCount,
    changePage,
    services,
    onClickUpdateButton,
}: any) => {
    return (
        <>
            <Row gutter={[24, 24]}>
                {services.map((service: Service) => {
                    return (
                        <Col span={6}>
                            <Card
                                cover={
                                    <img
                                        style={{
                                            maxWidth: '100%',
                                            height: '230px',
                                        }}
                                        src={service.image}
                                    ></img>
                                }
                            ></Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};
