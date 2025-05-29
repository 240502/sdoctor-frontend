import {  Card, Row, Col,Image } from 'antd';
import { baseURL } from '../../../../constants/api';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
import { Department } from '../../../../models';

interface DepartmentCardsProps {
    departments:Department[]
}
export const DepartmentCards = ({ departments }:DepartmentCardsProps) => {
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    const navigate = useNavigate();
    return (
        <>
            <Row  gutter={[24,24]} align={"stretch"}>
                <>
                    {departments?.map((department: Department) => {
                        return (
                            <Col
                                span={6}
                                key={department.id}
                                style={{cursor:"pointer"}}
                                onClick={() => {
                                    navigate('/list/doctor');
                                    setDoctorOptions({
                                                        ...doctorOptions,
                                                        departmentIds: [department.id],
                                                    });
                                }}
                            >
                                <Card
                                    className="shadow text-center"
                                    
                                >
                                    <Row gutter={24} justify={'space-between'} align={'middle'}>
                                        <Col span={6}>
                                            <Image
                                                preview={false}
                                                src={baseURL + department?.imageUrl}
                                               
                                            />
                                        </Col>
                                        <Col span={18}>
                                            <h6>{department?.name}</h6>
                                            <p className='mb-0 fw-medium'>{ department.totalDoctor} bác sĩ</p>
                                        </Col>
                                    </Row>
                                   
                                </Card>
                            </Col>
                        );
                    })}
                    
                </>
            </Row>
        </>
    );
};
