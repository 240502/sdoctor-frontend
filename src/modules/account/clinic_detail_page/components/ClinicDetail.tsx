import { Col, Row, Skeleton } from "antd";
import { useGetMedicalEquipmentByClinicId, useGetWorkingHoursByClinicId,useFetchClinicById } from "../../../../hooks";
import { useEffect } from "react";
import parse from 'html-react-parser';
import { WorkingHours } from "../../../../models";

interface ClinicDetailProps{
    clinicId: number;
    description: string;
}
const ClinicDetail = ({ clinicId,description }: ClinicDetailProps) => {
    const { data: workingHours, isFetching: isFetchingWorkingHours } = useGetWorkingHoursByClinicId(clinicId);
    const { data: medicalEquipments, isFetching: isFetchingMedicalEquipments } = useGetMedicalEquipmentByClinicId(clinicId);
    useEffect(() => {
       console.log('workingHours',workingHours);
    }, [workingHours])
    useEffect(() => {
        console.log('medicalEquipments',medicalEquipments);
     }, [medicalEquipments])
    return <Row gutter={24}>
        <Skeleton active loading={isFetchingWorkingHours}>
            <Col span={24}>
                {
                    workingHours?.map((workingHour:WorkingHours) => {
                        <Row gutter={24}>
                            <Col span={12}>
                                {workingHour.dayOfWeek}
                            </Col>
                            <Col span={12}>
                                {workingHour.startTime +', '+ workingHour.endTime}
                            </Col>
                        </Row>
                    })
                }
            </Col>
        </Skeleton>
      
    </Row>
}

export default ClinicDetail;