import { DollarOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Image, Row, Col, Divider, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { serviceListValue } from '../../../../stores/servicesAtom';
import { Service } from '../../../../models/service';
import { ServiceService } from '../../../../services/serviceService';
import { BlockDescription } from '../components/BlockDescription';

type DataParams = {
    id: string;
};
const ViewDetailService = () => {
    const services = useRecoilValue(serviceListValue);
    const { id } = useParams<DataParams>();
    const [service, setService] = useState<Service>({} as Service);

    const getServiceById = async (id: number) => {
        if (services?.length > 0) {
            const service = services.find(
                (service: Service) => service.id === Number(id)
            );
            if (service) setService(service);
        } else {
            try {
                const res = await ServiceService.getServiceById(id);
                console.log('service', res);
                setService(res);
            } catch (err: any) {
                console.log(err.message);
            }
        }
    };

    useEffect(() => {
        getServiceById(Number(id));
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className=" clinic-detail ">
            <div className="position-relative container mt-4 mb-4">
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { title: 'Chi tiết cơ sở y tế' },
                    ]}
                />
                <div
                    className="image-cover position-relative overflow-hidden mt-3"
                    style={{ maxHeight: '400px' }}
                >
                    <img
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                        }}
                        // className="position-absolute start-0 end-0 bottom-0"
                        src={service?.coverImage}
                    />
                </div>
                <Row className="clinic-info align-items-center" gutter={24}>
                    <Col
                        span={4}
                        className="rounded-circle clinic-image text-center"
                    >
                        <Image
                            src={service?.image}
                            preview={false}
                            width={128}
                            className="rounded-circle shadow"
                        ></Image>
                    </Col>
                    <Col span={20} className="pt-3">
                        <h5>{service?.name}</h5>
                        <p className="price">
                            <DollarOutlined />{' '}
                            <span className="text-success fw-bold">
                                {' '}
                                {service?.price?.toLocaleString()} VNĐ
                            </span>
                        </p>
                    </Col>
                </Row>
            </div>
            <Divider className="divider" />
            <div className="container">
                <div className="tabs">
                    <Tabs
                        // onChange={(key: string) => {
                        //     setSelectedKey(key);
                        // }}
                        className=""
                        // onClick={handleChangeMenu}
                        items={[
                            {
                                key: '1',
                                label: 'Thông tin cơ bản',
                                children: (
                                    <>
                                        {service?.id && (
                                            <BlockDescription
                                                service={service}
                                            />
                                        )}
                                    </>
                                ),
                            },
                            {
                                key: '2',
                                label: 'Đánh giá',
                                children: <></>,
                            },
                        ]}
                    ></Tabs>
                </div>
            </div>
        </div>
    );
};
export default ViewDetailService;
