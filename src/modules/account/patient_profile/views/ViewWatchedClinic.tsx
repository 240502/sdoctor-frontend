import React, { useEffect, useState } from 'react';
import { Clinic } from '../../../../models/clinic';
import { Button, Card, Pagination } from 'antd';
import { baseURL } from '../../../../constants/api';
import { Link, useNavigate } from 'react-router-dom';
import { PatientProfileLayout } from '../components/PatientProfileLayout';

const ViewWatchedClinic = () => {
    const [watchedClinics, setWatchedClinics] = useState<Clinic[]>([]);
    const [currentClinics, setCurrentClinics] = useState<Clinic[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totolItems, setTotalItems] = useState<number>(0);
    const navigate = useNavigate();
    const getWatchedClinics = () => {
        const clinics = JSON.parse(
            localStorage.getItem('watchedClinics') || '[]'
        );
        setTotalItems(clinics.length);
        setWatchedClinics(clinics);
        handlePagination(clinics, pageIndex, pageSize);
        // Xử lý phân trang
    };
    const handlePagination = (
        clinics: Clinic[],
        pageIndex: number,
        pageSize: number
    ) => {
        const indexOfLastClinic = (pageIndex + 1) * pageSize;
        const indexOfFirstClinic = indexOfLastClinic - pageSize;
        const currentClinics = clinics.slice(
            indexOfFirstClinic,
            indexOfLastClinic
        );
        console.log(indexOfFirstClinic, indexOfFirstClinic);
        setCurrentClinics(currentClinics);
    };
    const onPageChange = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageSize(pageSize);
            setPageIndex(1);
        } else {
            setPageSize(current);
        }
    };

    useEffect(() => {
        getWatchedClinics();
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (watchedClinics.length > 0) {
            handlePagination(watchedClinics, pageIndex, pageSize);
        }
    }, [pageIndex, pageSize, watchedClinics.length]);
    return (
        <PatientProfileLayout breadcrumb="Cơ sở y tế đã xem">
            <div className="row ">
                {currentClinics.length > 0 ? (
                    <>
                        {currentClinics.map((clinic: Clinic) => {
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
                                                src={
                                                    clinic.avatar.includes(
                                                        'cloudinary'
                                                    )
                                                        ? clinic.avatar
                                                        : baseURL +
                                                          clinic.avatar
                                                }
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
                                                to={
                                                    '/clinic/detail/' +
                                                    clinic.id
                                                }
                                            >
                                                {clinic.name}
                                            </Link>
                                        </p>
                                    </Card>
                                </div>
                            );
                        })}
                        <Pagination
                            pageSize={pageSize}
                            current={pageIndex}
                            total={totolItems}
                            showSizeChanger
                            pageSizeOptions={['5', '10', '15', '20']}
                            onChange={onPageChange}
                        />
                    </>
                ) : (
                    <p className="text-center">Không có cơ sở y tế nào !</p>
                )}
            </div>
        </PatientProfileLayout>
    );
};

export default ViewWatchedClinic;
