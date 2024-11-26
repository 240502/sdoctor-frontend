import React, { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Button, Card } from 'antd';
import { baseURL } from '../../../../constants/api';
import { Link } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';

const ViewWatchedClinic = () => {
    const [watchedClinics, setWatchedClinics] = useState<Clinic[]>([]);
    const getWatchedClinics = () => {
        const clinics = JSON.parse(
            localStorage.getItem('watchedClinics') || '[]'
        );
        setWatchedClinics(clinics);
    };
    useEffect(() => {
        getWatchedClinics();
        window.scrollTo(0, 0);
    }, []);
    return (
        <PatientProfileLayout breadcrumb="Cơ sở y tế đã xem">
            <div className="row ">
                {watchedClinics.map((clinic: Clinic) => {
                    return (
                        <div className="col-4 ps-2 pe-2 mb-5">
                            <Card
                                className="shadow"
                                cover={
                                    <img
                                        className="w-100 p-2"
                                        style={{
                                            height: '147px',
                                            objectFit: 'contain',
                                        }}
                                        alt="example"
                                        src={baseURL + clinic.avatar}
                                    />
                                }
                                actions={[
                                    <Button>
                                        {' '}
                                        <Link
                                            to={'/clinic/detail/' + clinic.id}
                                            className="w-100 text-dark text-decoration-none"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </Button>,
                                ]}
                            >
                                <p className="fw-bold text-center">
                                    {clinic.name}
                                </p>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedClinic;
