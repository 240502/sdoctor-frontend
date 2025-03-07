import { useEffect } from 'react';
import { Button, Card, Flex, Row, Col, Image, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../../services/doctorService';
import { Doctor } from '../../../../models/doctor';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { commonDoctorsState, doctorState } from '../../../../stores/doctorAtom';
import { EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { addWatchedDoctor } from '../../../../utils/doctor';
export const BlockHotDoctor = (): JSX.Element => {
    const navigate = useNavigate();
    const setDoctor = useSetRecoilState(doctorState);
    const [commonDoctors, setCommonDoctors] =
        useRecoilState(commonDoctorsState);
    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const loadData = async () => {
        try {
            const data = {};
            const res = await doctorService.getCommonDoctor(data);
            setCommonDoctors(res.data);
        } catch (err: any) {
            console.log(err.message);
            setCommonDoctors([]);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="block-common-doctor row mt-5">
            <div className="block__header d-flex justify-content-between align-items-center">
                <h3 className="block__title fs-4 fw-bold">Bác sĩ nổi bật</h3>
                <Button
                    className="pt-3 pb-3 fs-5"
                    onClick={() => {
                        navigate('/list/doctor');
                    }}
                >
                    {' '}
                    Xem thêm
                </Button>
            </div>
            <Row className="block-container mt-4" gutter={16}>
                {commonDoctors?.length > 0 ? (
                    commonDoctors?.map((doctor: Doctor) => {
                        return (
                            <Col
                                className=" mb-3"
                                span={6}
                                key={doctor.doctor_id}
                            >
                                <Card
                                    className="shadow position-relative"
                                    actions={[]}
                                >
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
                                            addWatchedDoctor(doctor);
                                        }}
                                        preview={false}
                                        className="rounded object-fit-cover doctor-image"
                                    ></Image>
                                    <Flex className="justify-content-between align-items-center ">
                                        <Tag color="blue" className="mt-2">
                                            {doctor.major_name}
                                        </Tag>
                                        {doctor?.average_star && (
                                            <div className="star text-end ">
                                                <StarFilled className="text-warning " />
                                                <span className="score d-inline-block ms-2">
                                                    {doctor?.average_star
                                                        ?.toString()
                                                        .slice(0, 3)}
                                                    /5
                                                </span>
                                            </div>
                                        )}
                                    </Flex>
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
                                                addWatchedDoctor(doctor);
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
