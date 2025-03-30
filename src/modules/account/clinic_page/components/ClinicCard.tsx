import { Row, Button, Image, Col } from 'antd';
import { Clinic } from '../../../../models/clinic';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addWatchedClinic } from '../../../../utils/clinic';
import { useUpdateClinicViews } from '../../../../hooks';
export const ClinicCard = ({ clinics }: any) => {
    const navigate = useNavigate();
    const updateClinicViews = useUpdateClinicViews();
    return (
        <Row gutter={[24, 24]} className="cards" justify={'start'}>
            {clinics.map((clinic: Clinic) => {
                return (
                    <Col
                        span={8}
                        className="card-item gutter-row"
                        key={clinic.id}
                    >
                        <div className="card-container p-3 rounded border">
                            <div className="clinic-image">
                                <Image
                                    className="text-centerobject-fit-contain"
                                    onClick={() => {
                                        navigate(
                                            '/clinic/detail/' + clinic?.id
                                        );
                                        updateClinicViews.mutate(clinic?.id);
                                        addWatchedClinic(clinic);
                                    }}
                                    preview={false}
                                    src={clinic.avatar}
                                />
                            </div>

                            <h6
                                className="clinic-name mt-2 mb-3"
                                onClick={() => {
                                    navigate('/clinic/detail/' + clinic?.id);
                                    updateClinicViews.mutate(clinic?.id);
                                    addWatchedClinic(clinic);
                                }}
                            >
                                {clinic.name}
                            </h6>

                            <div className="clinic-info p-2 rounded">
                                <p>
                                    <EnvironmentOutlined /> {clinic.location}
                                </p>
                                <div className="text-center">
                                    <Button
                                        className="booking-btn w-75"
                                        onClick={() => {
                                            navigate(
                                                '/clinic/detail/' + clinic?.id
                                            );
                                        }}
                                    >
                                        Đặt lịch bệnh viện
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};
