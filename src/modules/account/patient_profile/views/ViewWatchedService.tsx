import React, { useEffect, useState } from 'react';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { Button, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Services } from '../../../../models/services';
import { baseURL } from '../../../../constants/api';
const ViewWatchedService = () => {
    const [watchedServices, setWatchedServices] = useState<any>([]);
    const navigate = useNavigate();
    const getWatchedServices = () => {
        const services = JSON.parse(
            localStorage.getItem('watchedServices') || '[]'
        );
        setWatchedServices(services);
    };
    useEffect(() => {
        getWatchedServices();
        window.scrollTo(0, 0);
    }, []);
    return (
        <PatientProfileLayout breadcrumb="Dịch vụ đã xem">
            {watchedServices.length > 0 ? (
                <div className="row ">
                    {watchedServices.length > 0 ? (
                        watchedServices.map((service: Services) => {
                            return (
                                <div className="col-4 ps-2 pe-2 mb-5">
                                    <Card
                                        className="shadow"
                                        cover={
                                            <img
                                                onClick={() =>
                                                    navigate(
                                                        '/service/detail/' +
                                                            service.id
                                                    )
                                                }
                                                className="w-100 p-2"
                                                style={{
                                                    height: '147px',
                                                    objectFit: 'contain',
                                                }}
                                                alt="example"
                                                src={baseURL + service.image}
                                            />
                                        }
                                        actions={[
                                            <Button>
                                                {' '}
                                                <Link
                                                    to={
                                                        '/service/detail/' +
                                                        service.id
                                                    }
                                                    className="w-100 text-dark text-decoration-none"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </Button>,
                                        ]}
                                    >
                                        <h6>
                                            <Link
                                                className="text-decoration-none text-dark"
                                                to={
                                                    '/service/detail/' +
                                                    service.id
                                                }
                                            >
                                                {service.name}
                                            </Link>
                                        </h6>
                                    </Card>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-white">Không có dịch vụ nào!</p>
                    )}
                </div>
            ) : (
                <div className="text-center">Bạn chưa xem gói khám nào!</div>
            )}
        </PatientProfileLayout>
    );
};
export default ViewWatchedService;
