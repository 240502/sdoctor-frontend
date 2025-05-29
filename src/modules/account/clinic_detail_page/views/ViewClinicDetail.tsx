import {
    Breadcrumb,
    Col,
    Divider,
    Image,
    Row,
    Skeleton,
    Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../../../constants/api';
import '@/assets/scss/clinic.scss';
// import { doctorService } from '../../../../services/doctor.service';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import { useFetchClinicById, } from '../../../../hooks';
import DoctorsTab from '../components/DoctorsTab';
import MedicalPackage from '../components/MedicalPackage';
import ClinicDetail from '../components/ClinicDetail';

const ViewClinicDetail = () => {
    const { id } = useParams<any>();
    const { data, error, isFetching } = useFetchClinicById(Number(id));
    const [current, setCurrent] = useState<string>('0');

    const [selectedKey, setSelectedKey] = useState<string>('1');
   
    
   
    
    
    

    const handleChangeMenu = (e: any) => {
        setCurrent(e.key);
    };
    

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);
   
    return (
        <Skeleton active loading={isFetching}>
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
                            src={
                                data?.coverImage?.includes('cloudinary')
                                    ? data.coverImage
                                    : baseURL + data?.coverImage
                            }
                        />
                    </div>
                    <Row className="clinic-info align-items-center" gutter={24}>
                        <Col
                            span={4}
                            className="rounded-circle clinic-image text-center"
                        >
                            <Image
                                src={data?.avatar}
                                preview={false}
                                width={128}
                                className="rounded-circle shadow"
                            ></Image>
                        </Col>
                        <Col span={20} className="pt-3">
                            <h5>{data?.name}</h5>
                            <p className="opacity-75">
                                <EnvironmentOutlined /> {data?.location}
                            </p>
                        </Col>
                    </Row>
                </div>
                <Divider className="divider"></Divider>
                <div className="container">
                    <div className="tabs">
                        <Tabs
                            onChange={(key: string) => {
                                setSelectedKey(key);
                            }}
                            className=""
                            onClick={handleChangeMenu}
                            items={[
                                {
                                    key: '1',
                                    label: 'Giới thiệu chung',
                                    children: (
                                        <ClinicDetail clinicId={Number(id)}/>
                                    ),
                                },
                                {
                                    key: '2',
                                    label: 'Bác sĩ',
                                    children: (
                                        <DoctorsTab clinicId={Number(id)} />
                                    ),
                                },
                                {
                                    key: '3',
                                    label: 'Dịch vụ',
                                    children: (
                                        <MedicalPackage clinicId={Number(id)} />
                                    ),
                                },
                            ]}
                        ></Tabs>
                    </div>
                </div>
            </div>
        </Skeleton>
    );
};

export default ViewClinicDetail;
