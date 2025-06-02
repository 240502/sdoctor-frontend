import { Col, Row, Skeleton } from 'antd';
import {
    useGetMedicalEquipmentByClinicId,
    useGetWorkingHoursByClinicId,
    useFetchClinicById,
    useFetchDepartmentByClinicId,
} from '../../../../hooks';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import { Department, MedicalEquipment, WorkingHours } from '../../../../models';

interface ClinicDetailProps {
    clinicId: number;
    description: string;
}
const ClinicDetail = ({ clinicId, description }: ClinicDetailProps) => {
    const { data: workingHours, isFetching: isFetchingWorkingHours } =
        useGetWorkingHoursByClinicId(clinicId);
    const { data: medicalEquipments, isFetching: isFetchingMedicalEquipments } =
        useGetMedicalEquipmentByClinicId(clinicId);
    const { data: faculties, isFetching: isFetchingFaculties } =
        useFetchDepartmentByClinicId(clinicId);
    useEffect(() => {
        console.log('workingHours', workingHours);
    }, [workingHours]);
    useEffect(() => {
        console.log('medicalEquipments', medicalEquipments);
    }, [medicalEquipments]);
    return (
        <Row gutter={24}>
            <Skeleton active loading={isFetchingWorkingHours}>
                {workingHours?.length > 0 && (
                    <Col span={24}>
                        <h6 className="title d-flex">Giờ làm việc</h6>
                        {workingHours?.map((workingHour: WorkingHours) => {
                            return (
                                <Row gutter={24}>
                                    <Col span={6}>{workingHour.dayOfWeek}</Col>
                                    <Col span={12} className="fs-6">
                                        {workingHour.startTime +
                                            ', ' +
                                            workingHour.endTime}
                                    </Col>
                                </Row>
                            );
                        })}
                    </Col>
                )}
            </Skeleton>
            <Col span={24}>
                <h6 className="title d-flex">Thông tin bệnh viện</h6>
                <div className="fs-6" style={{ textAlign: 'justify' }}>
                    {parse(description)}
                </div>
            </Col>
            <Skeleton active loading={isFetchingFaculties}>
                {faculties?.length > 0 && (
                    <Col span={24}>
                        <h6 className="title d-flex">Chuyên khoa</h6>
                        <ul className="d-flex flex-wrap">
                            {faculties?.map((department: Department) => {
                                return (
                                    <li
                                        className="col-6 fs-6"
                                        key={department.id}
                                    >
                                        {' '}
                                        {department.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                )}
            </Skeleton>
            <Skeleton active loading={isFetchingMedicalEquipments}>
                {medicalEquipments?.length > 0 && (
                    <Col span={24}>
                        <h6 className="title d-flex">Cơ sở vật chất</h6>
                        <ul className="d-flex flex-wrap">
                            {medicalEquipments?.map(
                                (equipment: MedicalEquipment) => {
                                    return (
                                        <li
                                            className="col-6 fs-6"
                                            key={equipment.id}
                                        >
                                            {' '}
                                            {equipment.name}
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </Col>
                )}
            </Skeleton>
        </Row>
    );
};

export default ClinicDetail;
