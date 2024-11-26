import { Card, Flex } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export const RecentPatientCard = () => {
    return (
        <Card className="shadow" title="Bệnh nhân mới">
            <Flex className="justify-content-between">
                <div className="col-6 ps-2 pe-2">
                    <Card style={{ backgroundColor: '#F8FAFC' }}>
                        <Link to="">Nguyễn Văn Sang</Link>
                    </Card>
                </div>
                <div className="col-6 ps-2 pe-2">
                    <Card style={{ backgroundColor: '#F8FAFC' }}>
                        Bệnh nhân 2{' '}
                    </Card>
                </div>
            </Flex>
        </Card>
    );
};
