import { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Button, Col, Image, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { EnvironmentOutlined } from '@ant-design/icons';
import '@/assets/scss/clinic.scss';
import { ClinicService } from '../../../../services/clinic.service';

const ViewWatchedClinic = () => {
    const [watchedClinics, setWatchedClinics] = useState<Clinic[]>([]);
    const navigate = useNavigate();
    const getWatchedClinics = () => {
        const clinics = JSON.parse(
            localStorage.getItem('watchedClinics') || '[]'
        );
        setWatchedClinics(clinics);
    };

    const handleUpdateViewsClinic = async (id: number) => {
        try {
            const res = await ClinicService.updateViewsClinic(id);
            console.log(res);
        } catch (err: any) {}
    };
    useEffect(() => {
        getWatchedClinics();
        window.scrollTo(0, 0);
    }, []);
    return (
        <PatientProfileLayout breadcrumb="Cơ sở y tế đã xem">
            <div className="row ">
                {watchedClinics.length > 0 ? (
                    <>
                        <Row gutter={16}>
                            {watchedClinics.map((clinic: Clinic) => {
                                return (
                                    <Col
                                        span={6}
                                        className="card-item "
                                        key={clinic.id}
                                    >
                                        <div className="card-container flex-grow-1 flex-column h-100 rounded border border-1 ">
                                            <div className="clinic-image text-center m-auto">
                                                <Image
                                                    height={150}
                                                    onClick={() => {
                                                        navigate(
                                                            '/clinic/detail/' +
                                                                clinic?.id
                                                        );
                                                        handleUpdateViewsClinic(
                                                            clinic?.id
                                                        );
                                                    }}
                                                    className=" object-fit-contain"
                                                    preview={false}
                                                    src={clinic.avatar}
                                                ></Image>
                                            </div>
                                            <h6
                                                className="clinic-name text-center mt-2 mb-5"
                                                onClick={() => {
                                                    navigate(
                                                        '/clinic/detail/' +
                                                            clinic?.id
                                                    );
                                                    handleUpdateViewsClinic(
                                                        clinic?.id
                                                    );
                                                }}
                                            >
                                                {clinic.name}
                                            </h6>

                                            <div className="clinic-info">
                                                <p>
                                                    <EnvironmentOutlined />{' '}
                                                    {clinic.location}
                                                </p>
                                                <div className="button text-center">
                                                    <Button
                                                        className="booking-btn w-75"
                                                        onClick={() => {
                                                            navigate(
                                                                '/clinic/detail/' +
                                                                    clinic?.id
                                                            );
                                                        }}
                                                    >
                                                        Đặt lịch bệnh viện
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </>
                ) : (
                    <p className="text-center">Không có cơ sở y tế nào !</p>
                )}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedClinic;
