import React, { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Button, Card } from 'antd';
import { baseURL } from '../../../../constants/api';
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';

const ViewWatchedClinic = () => {
    const [watchedClinics, setWatchedClinics] = useState<Clinic[]>([]);
    const navigate = useNavigate();
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
                {watchedClinics.length > 0 ? (
                    watchedClinics.map((clinic: Clinic) => {
                        return (
                            <div className="col-4 ps-2 pe-2 mb-5">
                                <Card
                                    className="shadow"
                                    cover={
                                        <img
                                            onClick={() =>
                                                navigate(
                                                    '/clinic/detail/' +
                                                        clinic.id
                                                )
                                            }
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
                                            <Link
                                                to={
                                                    '/clinic/detail/' +
                                                    clinic.id
                                                }
                                                className="w-100 text-dark text-decoration-none"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </Button>,
                                    ]}
                                >
                                    <p className="fw-bold text-center">
                                        <Link
                                            className="text-decoration-none text-dark"
                                            to={'/clinic/detail/' + clinic.id}
                                        >
                                            {clinic.name}
                                        </Link>
                                    </p>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">Không có cơ sở y tế nào !</p>
                )}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedClinic;
