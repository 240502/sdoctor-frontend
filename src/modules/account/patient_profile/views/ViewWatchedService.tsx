import React, { useEffect, useState } from 'react';
import { PatientProfileLayout } from '../components/PatientProfileLayout';
import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { Services } from '../../../../models/services';
import { baseURL } from '../../../../constants/api';
const ViewWatchedService = () => {
    const [watchedServices, setWatchedServices] = useState<any>([]);
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
                    {watchedServices.map((service: Services) => {
                        return (
                            <div className="col-4 ps-2 pe-2 mb-5">
                                <Card
                                    cover={
                                        <img
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
                                                    '/clinic/service/' +
                                                    service.id
                                                }
                                                className="w-100 text-dark text-decoration-none"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </Button>,
                                    ]}
                                >
                                    <h6>{service.name}</h6>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center">Bạn chưa xem gói khám nào!</div>
            )}
        </PatientProfileLayout>
    );
};
export default ViewWatchedService;
