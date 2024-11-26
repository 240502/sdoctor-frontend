import React from 'react';
import { Card, Flex } from 'antd';

interface SummaryCardsProps {
    totalPatientInDay: number;
    totalPatientExaminedInDay: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
    totalPatientInDay,
    totalPatientExaminedInDay,
}) => {
    return (
        <Flex vertical gap="middle">
            <Card className="shadow">
                <h6 className="box__title d-flex justify-content-between ">
                    <span className="text-center col-8">
                        Đã khám hôm nay
                        <p className="total__patient text-center m-0 mt-2">
                            {totalPatientExaminedInDay}
                        </p>
                    </span>
                    <span className="text-center col-3">
                        <i className="fa-solid fa-user-injured fs-3"></i>
                    </span>
                </h6>
            </Card>
            <Card className="shadow">
                <h6 className="box__title d-flex justify-content-between ">
                    <span className="text-center col-8">
                        Bệnh nhân hôm nay
                        <p className="total__patient text-center m-0 mt-2">
                            {totalPatientInDay}
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
                        Lịch hẹn hôm nay
                        <p className="total__patient text-center m-0 mt-2">
                            {totalPatientInDay}
                        </p>
                    </span>
                    <span className="col-3 text-center">
                        <i className="fa-solid fa-calendar-days fs-3"></i>
                    </span>
                </h6>
            </Card>
        </Flex>
    );
};

export default SummaryCards;
