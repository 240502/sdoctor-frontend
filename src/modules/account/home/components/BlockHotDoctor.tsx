import { useEffect, useState } from 'react';
import { Button, Card, Flex, Row, Col, Image, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    doctorListState,
    doctorListValue,
    doctorState,
} from '../../../../stores/doctorAtom';
import { EnvironmentOutlined } from '@ant-design/icons';
export const BlockHotDoctor = (): JSX.Element => {
    const navigate = useNavigate();
    const setDoctors = useSetRecoilState(doctorListState);
    const setDoctor = useSetRecoilState(doctorState);
    const doctors = useRecoilValue(doctorListValue);
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const loadData = async () => {
        try {
            const data = await doctorService.getCommonDoctor();
            setDoctors(data);
        } catch (err: any) {
            console.log(err.message);
            setDoctors([]);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="block-common-doctor row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bác sĩ nổi bật</h3>
            </div>
            <Row className="block-container mt-4" gutter={16}>
                {doctors.length > 0 ? (
                    doctors?.map((doctor: Doctor) => {
                        return (
                            <Col className=" mb-3" span={6}>
                                <Card className="shadow" actions={[]}>
                                    <Image
                                        src={doctor.image}
                                        onClick={() => {
                                            navigate(
                                                '/doctor/detail/' +
                                                    doctor.doctor_id
                                            );
                                            handleUpdateViewsDoctor(
                                                doctor.doctor_id
                                            );
                                        }}
                                        preview={false}
                                        className="rounded object-fit-cover doctor-image"
                                    ></Image>
                                    <Tag color="blue" className="mt-2">
                                        {doctor.major_name}
                                    </Tag>
                                    <h6 className="mt-2">
                                        <Link
                                            className="text-decoration-none text-dark"
                                            to={
                                                '/doctor/detail/' +
                                                doctor.doctor_id
                                            }
                                            onClick={() => {
                                                handleUpdateViewsDoctor(
                                                    doctor.doctor_id
                                                );
                                            }}
                                        >
                                            Bác sĩ. {doctor.full_name}
                                        </Link>
                                    </h6>
                                    <div className="location">
                                        <EnvironmentOutlined className="me-2" />
                                        {doctor.location}
                                    </div>
                                    <div className="button-container text-center">
                                        <Button
                                            className="mt-2 border-primary text-primary w-75 btn-book-now"
                                            onClick={() => {
                                                navigate(
                                                    '/booking-appointment'
                                                );
                                                setDoctor(doctor);
                                            }}
                                        >
                                            Đặt lịch ngay
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <p>Không có bác sĩ nào !</p>
                )}
            </Row>
        </div>
    );
};
