import React, { useEffect, useState } from 'react';
import { Doctor } from '../../../../models/doctor';
import { Avatar, Button, Card } from 'antd';
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
const ViewWatchedDoctor = () => {
    const [watchedDoctors, setWatchedDoctors] = useState<Doctor[]>([]);
    const getWatchedDoctor = () => {
        const doctors = JSON.parse(
            localStorage.getItem('watchedDoctors') || '[]'
        );
        setWatchedDoctors(doctors);
    };

    useEffect(() => {
        getWatchedDoctor();
    }, []);
    useEffect(() => {
        console.log('watched doctor', watchedDoctors);
    }, [watchedDoctors]);
    return (
        <PatientProfileLayout breadcrumb="Bác sĩ đã xem">
            {' '}
            <div className="d-flex ">
                {watchedDoctors.map((doctor: Doctor) => {
                    return (
                        <div className="col-4 ps-2 pe-2">
                            <Card
                                cover={
                                    <img
                                        alt="example"
                                        src={baseURL + doctor.image}
                                    />
                                }
                                actions={[
                                    <Button>
                                        {' '}
                                        <Link
                                            to={'/doctor/detail/' + doctor.id}
                                            className="w-100 text-dark text-decoration-none"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </Button>,
                                ]}
                            >
                                <p>{doctor.title}</p>
                                <h6>{doctor.full_name}</h6>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedDoctor;
