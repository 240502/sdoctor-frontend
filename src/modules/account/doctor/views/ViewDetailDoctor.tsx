import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import {
    Breadcrumb,
    Image,
    notification,
    Button,
    Tag,
    Divider,
    Tabs,
    TabsProps,
    Row,
    Col,
    Flex,
    Pagination,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Doctor } from '../../../../models/doctor';
import { doctorService } from '../../../../services/doctorService';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { BlockComment } from '../components/BlockComment';
import { ModalComment } from '../components/ModalComment';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    commonDoctorsState,
    doctorListValue,
    doctorState,
} from '../../../../stores/doctorAtom';
import { useNavigate } from 'react-router-dom';
type NotificationType = 'success' | 'error';

type DataParams = {
    id: string;
};
const ViewDetailDoctor = () => {
    const navigate = useNavigate();
    const doctors = useRecoilValue(doctorListValue);
    const [isModalCommentOpen, setIsModalCommentOpen] = useState(false);
    const { id } = useParams<DataParams>();
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [commonDoctors, setCommonDoctors] =
        useRecoilState(commonDoctorsState);
    const [api, contextHolder] = notification.useNotification();
    const [pageSize, setPageSize] = useState<number>(4);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const setDoctorGlobal = useSetRecoilState(doctorState);
    const openNotificationWithIcon = (
        type: NotificationType,
        title: string,
        des: string
    ) => {
        api[type]({
            message: title,
            description: des,
        });
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin chi tiết',
            children: <>{parse(String(doctor?.introduction))}</>,
        },
        {
            key: '2',
            label: 'Đánh giá',
            children: (
                <BlockComment
                    userId={id}
                    setIsModalCommentOpen={setIsModalCommentOpen}
                />
            ),
        },
    ];
    const getDoctorById = async (id: number) => {
        try {
            if (doctors.length > 0) {
                const res: any = doctors.find((doctor: Doctor) => {
                    if (doctor.doctor_id === Number(id)) return doctor;
                });
                setDoctor(res);
            } else {
                const res = await doctorService.getDoctorById(id);
                console.log(res);
                setDoctor(res);
            }
        } catch (err: any) {
            console.log(err.message);
        }
    };
    const getCommonDoctor = async () => {
        try {
            const data = { pageIndex: pageIndex, pageSize: pageSize };
            const res = await doctorService.getCommonDoctor(data);
            setCommonDoctors(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
            setCommonDoctors([]);
            setPageCount(0);
        }
    };
    useEffect(() => {
        getDoctorById(Number(id));
        window.scrollTo(0, 0);
    }, [id]);
    useEffect(() => {
        getCommonDoctor();
    }, [pageIndex, pageSize]);
    return (
        <div className="container doctor-detail mt-4 mb-4">
            {contextHolder}
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },
                    {
                        title: 'Chi tiết bác sĩ',
                    },
                ]}
            ></Breadcrumb>
            <Row className="mt-4 justify-content-between" gutter={24}>
                <Col span={16} className="doctor-info border rounded p-3">
                    <Flex className="">
                        <div className="doctor-image col-2">
                            <Image
                                style={{ width: '80%' }}
                                preview={false}
                                className="rounded-circle"
                                src={
                                    doctor?.image?.includes('cloudinary')
                                        ? String(doctor.image)
                                        : baseURL + doctor?.image
                                }
                            ></Image>
                        </div>
                        <div className="info ms-3">
                            <h5 className="doctor-name">
                                {doctor?.title} {doctor?.full_name}
                            </h5>
                            <Tag color="blue">{doctor?.major_name}</Tag>
                            <p className="doctor-location mt-2">
                                <EnvironmentOutlined className="me-2"></EnvironmentOutlined>
                                {doctor?.location}
                            </p>

                            <div className="mt-3">
                                <Button
                                    className="border-primary text-primary button-booking-now"
                                    onClick={() => {
                                        navigate('/booking-appointment');
                                        setDoctorGlobal(doctor);
                                    }}
                                >
                                    Đặt lịch khám
                                </Button>
                            </div>
                        </div>
                    </Flex>
                    <Divider className="mt-3" />

                    <div className="summary">
                        <h6 className="title d-flex">Điểm nổi bật</h6>
                        <ul className="summary-content">
                            {parse(String(doctor?.summary))}
                        </ul>
                    </div>
                    <Tabs items={items}></Tabs>
                </Col>
                <Col
                    span={7}
                    className="block-doctor-suggestion border rounded p-3"
                >
                    <h6 className="mb-3 fw-bold">Gợi ý</h6>
                    <Divider></Divider>
                    <Row gutter={24}>
                        {commonDoctors?.map((doctor: Doctor) => {
                            if (doctor.doctor_id !== Number(id)) {
                                return (
                                    <Col
                                        span={24}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Flex className="suggestion-doctor-item mt-2">
                                            <div className="doctor-image col-2">
                                                <Image
                                                    onClick={() => {
                                                        navigate(
                                                            '/doctor/detail/' +
                                                                doctor.doctor_id
                                                        );
                                                    }}
                                                    className="rounded-circle"
                                                    preview={false}
                                                    src={doctor?.image}
                                                ></Image>
                                            </div>
                                            <div className="doctor-info ms-2">
                                                <p
                                                    className="mt-2 mb-1 fw-bold doctor-name"
                                                    onClick={() => {
                                                        navigate(
                                                            '/doctor/detail/' +
                                                                doctor.doctor_id
                                                        );
                                                    }}
                                                >
                                                    {doctor?.full_name}
                                                </p>
                                                <Tag color="blue">
                                                    {doctor.major_name}
                                                </Tag>
                                                <p>
                                                    <EnvironmentOutlined />{' '}
                                                    {doctor?.address}
                                                </p>
                                            </div>
                                        </Flex>
                                        <Divider className="mt-2 mb-2"></Divider>
                                    </Col>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                        {pageCount > 1 && (
                            <Col span={24}>
                                <Pagination
                                    pageSize={pageSize}
                                    align="center"
                                    total={pageSize * pageCount}
                                    current={pageIndex}
                                    onChange={(
                                        current: number,
                                        size: number
                                    ) => {
                                        if (size !== pageSize) {
                                            setPageSize(size);
                                            setPageIndex(1);
                                        } else {
                                            setPageIndex(current);
                                        }
                                    }}
                                    showSizeChanger
                                    pageSizeOptions={['4', '8']}
                                />
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>

            {isModalCommentOpen && (
                <ModalComment
                    openNotificationWithIcon={openNotificationWithIcon}
                    doctorId={id}
                    isModalCommentOpen={isModalCommentOpen}
                    setIsModalCommentOpen={setIsModalCommentOpen}
                />
            )}
        </div>
    );
};
export default ViewDetailDoctor;
