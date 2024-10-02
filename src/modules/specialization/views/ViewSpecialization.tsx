import React from 'react';
import {
    HomeOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Image, DatePicker } from 'antd';
import { Link } from 'react-router-dom';

const ViewSpecialization = () => {
    return (
        <div className="container home__content mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Khám theo chuyên khoa`,
                    },
                ]}
            />
        </div>
    );
};
export default ViewSpecialization;
