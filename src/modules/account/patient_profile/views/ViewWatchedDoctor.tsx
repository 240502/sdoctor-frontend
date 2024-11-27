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
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
const ViewWatchedDoctor = () => {
    const navigate = useNavigate();
    const [watchedDoctors, setWatchedDoctors] = useState<Doctor[]>([]);
    const getWatchedDoctor = () => {
        const doctors = JSON.parse(
            localStorage.getItem('watchedDoctors') || '[]'
        );
        setWatchedDoctors(doctors);
    };

    useEffect(() => {
        getWatchedDoctor();
        window.scrollTo(0, 0);
    }, []);

    return (
        <PatientProfileLayout breadcrumb="Bác sĩ đã xem">
            <div className="row">
                {watchedDoctors.length > 0 ? (
                    watchedDoctors.map((doctor: Doctor) => {
                        return (
                            <div className="col-4 ps-2 pe-2 mb-5">
                                <Card
                                    className="shadow text-center"
                                    cover={
                                        <img
                                            onClick={() =>
                                                navigate(
                                                    '/doctor/detail/' +
                                                        doctor.id
                                                )
                                            }
                                            alt="example"
                                            src={baseURL + doctor.image}
                                        />
                                    }
                                    actions={[
                                        <Button>
                                            <Link
                                                to={
                                                    '/doctor/detail/' +
                                                    doctor.id
                                                }
                                                className="w-100 text-dark text-decoration-none"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </Button>,
                                    ]}
                                >
                                    <p>{doctor.title}</p>
                                    <h6>
                                        <Link
                                            className="text-decoration-none text-dark"
                                            to={'/doctor/detail/' + doctor.id}
                                        >
                                            {doctor.full_name}
                                        </Link>{' '}
                                    </h6>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">Không có bác sĩ nào!</p>
                )}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedDoctor;
