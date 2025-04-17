import { Button, Card, Flex, Row, Col, Image, Tag, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../../services';
import { Doctor } from '../../../../models';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import { addWatchedDoctor } from '../../../../utils/doctor';
import { useFetchCommonDoctors } from '../../../../hooks';
export const BlockCommonDoctor = (): JSX.Element => {
    const navigate = useNavigate();
    const setDoctor = useSetRecoilState(doctorState);

    const handleUpdateViewsDoctor = async (id: number) => {
        try {
            const res = await doctorService.updateViewsDoctor(id);
            console.log(res);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const { data, error, isFetching } = useFetchCommonDoctors({});

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
                    Xem thêm
                </Button>
            </div>
            <Row className="block-container mt-4" gutter={16}>
                {error ? (
                    <p className="text-center fw-bold w-100">{error.message}</p>
                ) : (
                    <Skeleton active loading={isFetching}>
                        {data?.doctors?.map((doctor: Doctor) => {
                            return (
                                <Col
                                    className=" mb-3"
                                    span={6}
                                    key={doctor.doctorId}
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
                                                        doctor.doctorId
                                                );
                                                handleUpdateViewsDoctor(
                                                    doctor.doctorId
                                                );
                                                addWatchedDoctor(doctor);
                                            }}
                                            preview={false}
                                            className="rounded object-fit-cover doctor-image"
                                        ></Image>
                                        <Flex className="justify-content-between align-items-center ">
                                            <Tag color="blue" className="mt-2">
                                                {doctor.majorName}
                                            </Tag>
                                            {doctor?.averageStar && (
                                                <div className="star text-end ">
                                                    <StarFilled className="text-warning " />
                                                    <span className="score d-inline-block ms-2">
                                                        {doctor?.averageStar
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
                                                    doctor.doctorId
                                                }
                                                onClick={() => {
                                                    handleUpdateViewsDoctor(
                                                        doctor.doctorId
                                                    );
                                                    addWatchedDoctor(doctor);
                                                }}
                                            >
                                                Bác sĩ. {doctor.fullName}
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
                                                    const queryParams =
                                                        new URLSearchParams();
                                                    console.log(
                                                        'doctorId',
                                                        doctor.doctorId
                                                    );

                                                    queryParams.append(
                                                        'doctorId',
                                                        doctor.doctorId.toString()
                                                    );
                                                    navigate(
                                                        `/booking-appointment?${queryParams}`
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
                        })}
                    </Skeleton>
                )}
            </Row>
        </div>
    );
};
