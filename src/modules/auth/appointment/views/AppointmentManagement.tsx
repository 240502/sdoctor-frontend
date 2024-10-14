import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Select } from 'antd';
import React from 'react';
import TableAppointment from '../components/TableAppointment';

const AppointmentManagement = () => {
    return (
        <div className="container">
            <div className="block__filter">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Lịch hẹn',
                        },
                    ]}
                />
                <Divider />
            </div>
            <div className="block__list__appointment">
                <h5 className="mb-3">Danh sách lịch hẹn</h5>

                <div className="mb-3"></div>
                <TableAppointment />
            </div>
        </div>
    );
};
export default AppointmentManagement;
