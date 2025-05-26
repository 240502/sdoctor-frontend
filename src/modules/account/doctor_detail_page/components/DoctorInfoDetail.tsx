import React from 'react';
import {
    Doctor,
    DoctorExpertises,
    Education,
    WorkExperience,
} from '../../../../models';
import parse from 'html-react-parser';
import {
    useFetchDoctorExperienceByDoctorId,
    useFetchDoctorExpertiseByDoctorId,
    useFetchEducationByDoctorId,
} from '../../../../hooks';
import { Col, Flex, Row, Skeleton, Tag, Typography } from 'antd';
interface DoctorInfoDetailProps {
    doctor: Doctor;
}
const DoctorInfoDetail = ({ doctor }: DoctorInfoDetailProps) => {
    const {
        data: doctorExperiences,
        isFetching: isFetchingDoctorExperiences,
        isError: isErrorFetchDoctorExperience,
    } = useFetchDoctorExperienceByDoctorId(doctor.doctorId);
    const {
        data: doctorExpertises,
        isFetching: isFetchingDoctorExpertises,
        isError: isFetchDoctorExpertiseError,
    } = useFetchDoctorExpertiseByDoctorId(doctor.doctorId);
    const {
        data: educations,
        isFetching: isFetchingEducation,
        isError: isFetchEducationError,
    } = useFetchEducationByDoctorId(doctor.doctorId);
    const now = new Date();
    return (
        <>
            <h6 className="title d-flex">Thông tin bác sĩ</h6>
            <div>{parse(doctor.introduction)}</div>
            <h6 className="title d-flex">Thế mạnh chuyên môn</h6>
            <Skeleton loading={isFetchingDoctorExpertises} active>
                <Flex wrap gap="middle" align="stretch" className="mb-3">
                    {!isFetchDoctorExpertiseError &&
                        doctorExpertises?.map((expertise: any) => {
                            return (
                                <Col
                                    className="gutter-row"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Tag
                                        color="rgb(248, 249, 252)"
                                        className="text-dark p-2 fw-medium rounded-5 shadow w-100 text-center text-wrap"
                                    >
                                        <Typography.Text>
                                            {expertise.expertise}
                                        </Typography.Text>
                                    </Tag>
                                </Col>
                            );
                        })}
                </Flex>
            </Skeleton>
            <Row gutter={24}>
                <Col span={12}>
                    <h6 className="title d-flex">Kinh nghiệm làm việc</h6>

                    <Skeleton loading={isFetchingDoctorExperiences} active>
                        <ul>
                            {!isErrorFetchDoctorExperience &&
                                doctorExperiences?.map(
                                    (experience: WorkExperience) => {
                                        return (
                                            <li>
                                                <p
                                                    className="fs-6 mb-0"
                                                    style={{ color: '#404040' }}
                                                >
                                                    {' '}
                                                    {experience.position}
                                                </p>
                                                <p
                                                    className="mb-0"
                                                    style={{
                                                        color: 'rgb(115, 115, 115)',
                                                    }}
                                                >
                                                    {experience.workplace}
                                                </p>
                                                <p
                                                    className="mb-0"
                                                    style={{
                                                        color: 'rgb(115, 115, 115)',
                                                    }}
                                                >
                                                    {experience.fromYear +
                                                        ' - ' +
                                                        (experience.toYear ===
                                                        Number(
                                                            now.getFullYear()
                                                        )
                                                            ? 'Hiện tại'
                                                            : experience.toYear)}
                                                </p>
                                            </li>
                                        );
                                    }
                                )}
                        </ul>
                    </Skeleton>
                </Col>
                <Col span={12}>
                    <h6 className="title d-flex align-items-center">
                        Quá trình đào tạo
                    </h6>
                    <Skeleton loading={isFetchingEducation} active>
                        <ul>
                            {!isFetchEducationError &&
                                educations?.map((eduation: Education) => {
                                    return (
                                        <li>
                                            <p
                                                className="fs-6 mb-0"
                                                style={{ color: '#404040' }}
                                            >
                                                {' '}
                                                {eduation.degree}
                                            </p>
                                            <p
                                                className="mb-0"
                                                style={{
                                                    color: 'rgb(115, 115, 115)',
                                                }}
                                            >
                                                {eduation.institution}
                                            </p>
                                            <p
                                                className="mb-0"
                                                style={{
                                                    color: 'rgb(115, 115, 115)',
                                                }}
                                            >
                                                {eduation.fromYear +
                                                    ' - ' +
                                                    (eduation.toYear ===
                                                    Number(now.getFullYear())
                                                        ? 'Hiện tại'
                                                        : eduation.toYear)}
                                            </p>
                                        </li>
                                    );
                                })}
                        </ul>
                    </Skeleton>
                </Col>
            </Row>
        </>
    );
};

export default DoctorInfoDetail;
