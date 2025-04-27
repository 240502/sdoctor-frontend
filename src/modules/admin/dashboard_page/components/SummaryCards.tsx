import React, { useEffect } from 'react';
import { Card, Flex } from 'antd';
import {
    useFetchAppointmentsCompleted,
    useFetchTotalAppointmentInDay,
    useFetchWaitingPatientsCount,
} from '../../../../hooks';

interface SummaryCardsProps {
    doctorId: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ doctorId }) => {
    const { data: totalPatientResponse } =
        useFetchTotalAppointmentInDay(doctorId);
    const { data: appointmentComletedResponse } =
        useFetchAppointmentsCompleted(doctorId);
    const { data: waitionPatientsCountResponse } =
        useFetchWaitingPatientsCount(doctorId);
    useEffect(() => {
        console.log(appointmentComletedResponse?.totalPatient);
    }, []);
    return (
        <Flex vertical gap="middle">
            <Card className="shadow">
                <h6 className="box__title d-flex justify-content-between ">
                    <span className="text-center col-8">
                        Tổng số bệnh nhân
                        <p className="total__patient text-center m-0 mt-2">
                            {totalPatientResponse?.totalPatient}
                        </p>
                    </span>
                    <span className="col-3 text-center">
                        <i className="fa-solid fa-bed fs-3"></i>
                    </span>
                </h6>
            </Card>

            <Card className="shadow">
                <h6 className="box__title d-flex justify-content-between ">
                    <span className="text-center col-8">
                        Bệnh nhân chờ khám
                        <p className="total__patient text-center m-0 mt-2">
                            {waitionPatientsCountResponse?.totalPatient}
                        </p>
                    </span>
                    <span className="col-3 text-center">
                        <i className="fa-solid fa-user-clock fs-3"></i>
                    </span>
                </h6>
            </Card>
            <Card className="shadow">
                <h6 className="box__title d-flex justify-content-between ">
                    <span className="text-center col-8">
                        Bệnh nhân đã khám
                        <p className="total__patient text-center m-0 mt-2">
                            {appointmentComletedResponse?.totalPatient}
                        </p>
                    </span>
                    <span className="text-center col-3">
                        <i className="fa-solid fa-check fs-3"></i>
                    </span>
                </h6>
            </Card>
        </Flex>
    );
};

export default SummaryCards;
