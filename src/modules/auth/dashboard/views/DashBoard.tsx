import React from 'react';
import {
    UserOutlined,
    AuditOutlined,
    DollarOutlined,
    ExceptionOutlined,
} from '@ant-design/icons';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
const DashBoard = () => {
    return (
        <div className="container">
            <div className="group__box d-flex  justify-content-between">
                <div className="box__item col-3 bg-light bg-gradient rounded p-3 shadow-lg">
                    <h6 className="box__title d-flex justify-content-between ">
                        <span>
                            Số lượng bệnh nhân
                            <p className="total__patient text-center m-0">0</p>
                        </span>
                        <span>
                            <UserOutlined className="fs-5"></UserOutlined>
                        </span>
                    </h6>
                </div>
                <div className="box__item col-3 bg-light bg-gradient rounded p-3 shadow-lg">
                    <h6 className="box__title d-flex justify-content-between ">
                        <span>
                            Số lượng lịch hẹn
                            <p className="total__patient text-center m-0">0</p>
                        </span>
                        <span>
                            <AuditOutlined className="fs-5" />
                        </span>
                    </h6>
                </div>
                <div className="box__item col-3 bg-light bg-gradient rounded p-3 shadow-lg">
                    <h6 className="box__title d-flex justify-content-between ">
                        <span>
                            Doanh thu
                            <p className="total__patient text-center m-0 ">0</p>
                        </span>
                        <span>
                            <DollarOutlined className="fs-5" />
                        </span>
                    </h6>
                </div>
                <div className="box__item col-3 bg-light bg-gradient rounded p-3 shadow-lg">
                    <h6 className="box__title d-flex justify-content-between ">
                        <span>
                            Tỷ lệ hủy hẹn
                            <p className="total__patient text-center m-0">0</p>
                        </span>
                        <span>
                            <ExceptionOutlined className="fs-5" />
                        </span>
                    </h6>
                </div>
            </div>
            <div className="block-line-chart mt-5 mb-3 d-flex justify-content-between ">
                <div className="" style={{ width: '48%' }}>
                    <BarChart />
                </div>
                <div className="" style={{ width: '48%' }}>
                    <LineChart />
                </div>
            </div>
        </div>
    );
};
export default DashBoard;
