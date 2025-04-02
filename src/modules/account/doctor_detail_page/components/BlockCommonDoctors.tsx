import { Col, Row, Flex, Image, Tag, Divider, Pagination } from 'antd';
import { useFetchCommonDoctors } from '../../../../hooks';
import { useNavigate } from 'react-router-dom';
import { Doctor } from '../../../../models';
import { EnvironmentOutlined } from '@ant-design/icons';

const BlockCommonDoctors = ({ doctorId }: { doctorId: number }) => {
    const navigate = useNavigate();

    const { data, error, isFetching } = useFetchCommonDoctors({
        pageIndex: 1,
        pageSize: 4,
        withoutId: doctorId,
    });
    return (
        <Row gutter={24}>
            {' '}
            {error ? (
                <p className="text-center fw-bold"> {error.message}</p>
            ) : (
                data?.doctors?.map((doctor: Doctor) => {
                    if (doctor.doctorId !== doctorId) {
                        return (
                            <Col
                                key={doctor?.doctorId}
                                span={24}
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                <Flex className="suggestion-doctor-item mt-2">
                                    <div className="doctor-image col-2">
                                        <Image
                                            onClick={() => {
                                                navigate(
                                                    '/doctor/detail/' +
                                                        doctor.doctorId
                                                );
                                            }}
                                            className="rounded-circle"
                                            preview={false}
                                            src={doctor?.image}
                                        ></Image>
                                    </div>
                                    <div className="doctor-info ms-2">
                                        <p
                                            className="mt-2 mb-1 fw-bold doctor-name"
                                            onClick={() => {
                                                navigate(
                                                    '/doctor/detail/' +
                                                        doctor.doctorId
                                                );
                                            }}
                                        >
                                            {doctor.title} {doctor?.fullName}
                                        </p>
                                        <Tag color="blue" className="mb-2">
                                            {doctor.majorName}
                                        </Tag>
                                        <p>
                                            <EnvironmentOutlined />{' '}
                                            {doctor.location}
                                        </p>
                                    </div>
                                </Flex>
                                <Divider className="mt-2 mb-2"></Divider>
                            </Col>
                        );
                    } else {
                        return <></>;
                    }
                })
            )}
            {/* {commonDoctorsRes?.pageCount !== 0 && (
                <Col span={24}>
                    <Pagination
                        pageSize={pageSize}
                        align="center"
                        total={
                            commonDoctorsRes?.pageSize *
                            commonDoctorsRes?.pageCount
                        }
                        current={commonDoctorsRes?.pageIndex}
                        onChange={(current: number, size: number) => {
                            if (size !== commonDoctorsRes?.pageSize) {
                                setPageSize(size);
                                setPageIndex(1);
                            } else {
                                setPageIndex(current);
                            }
                        }}
                    />
                </Col>
            )} */}
        </Row>
    );
};

export default BlockCommonDoctors;
