import {
    EnvironmentOutlined,
    HomeOutlined,
    StarFilled,
} from '@ant-design/icons';
import {
    Breadcrumb,
    Image,
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    commonDoctorsState,
    doctorListValue,
    doctorState,
} from '../../../../stores/doctorAtom';
import { useNavigate } from 'react-router-dom';
import { CommentService } from '../../../../services/commentService';
import socket from '../../../../socket';
import { Comment } from '../../../../models/comment';

type DataParams = {
    id: string;
};
const ViewDetailDoctor = () => {
    const navigate = useNavigate();
    const doctors = useRecoilValue(doctorListValue);
    const { id } = useParams<DataParams>();
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [commonDoctors, setCommonDoctors] =
        useRecoilState(commonDoctorsState);
    const [pageSize, setPageSize] = useState<number>(4);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [totalComment, setTotalComment] = useState<number>(0);
    const setDoctorGlobal = useSetRecoilState(doctorState);
    const [comments, setComments] = useState<Comment[]>([]);
    const [pageComment, setPageComment] = useState<number>(1);
    const [pageCommentSize, setPageCommentSize] = useState<number>(4);
    const [pageCommentCount, setPageCommentCount] = useState<number>(0);
    const onButtonMoreClick = () => {
        if (pageComment < pageCommentCount) {
            setPageComment(pageComment + 1);
        }
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
                    comments={comments}
                    totalItems={totalComment}
                    onButtonMoreClick={onButtonMoreClick}
                    pageCount={pageCommentCount}
                    pageIndex={pageComment}
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

    const getCommentByDoctorId = async (doctorId: number) => {
        try {
            const data = {
                pageIndex: pageComment,
                pageSize: pageCommentSize,
                doctorId: doctorId,
            };
            const res = await CommentService.getCommentByUserId(data);
            if (comments.length > 0) {
                const newComments = [...comments, ...res.data];

                setComments(newComments);
            } else {
                setTotalComment(res.totalItems);
                setPageCommentCount(res.pageCount);
                setComments(res.data);
            }
        } catch (err: any) {
            console.log(err);
            setTotalComment(0);
            setComments([]);
            setTotalComment(0);
        }
    };

    const handleOnNewComment = () => {
        socket?.on('newComment', (newComment: Comment) => {
            getCommentByDoctorId(Number(newComment.doctorId));
        });
    };
    useEffect(() => {
        handleOnNewComment();
    }, []);
    useEffect(() => {
        getDoctorById(Number(id));
        window.scrollTo(0, 0);
        getCommentByDoctorId(Number(id));
    }, [id]);
    useEffect(() => {
        getCommonDoctor();
    }, [pageIndex, pageSize]);
    useEffect(() => {
        getCommentByDoctorId(Number(id));
    }, [pageComment, pageCommentSize]);
    return (
        <div className="container doctor-detail mt-4 mb-4">
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
                    <Flex className="flex-row">
                        <Flex className="col-9">
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
                        <div className="col-3 text-end">
                            {doctor?.average_star !== null && (
                                <Tag
                                    color="default"
                                    className="fs-6 rounded border-0 p-32d-inline-block"
                                >
                                    <StarFilled className="text-warning" />
                                    <span className="fw-bold">
                                        {doctor?.average_star
                                            ?.toString()
                                            ?.slice(0, 3)}
                                        /5
                                    </span>
                                </Tag>
                            )}
                            <span className="text-decoration-underline fs-6">
                                {totalComment} đánh giá
                            </span>
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
                                        key={doctor?.doctor_id}
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
                                                    {doctor.title}{' '}
                                                    {doctor?.full_name}
                                                </p>
                                                <Tag
                                                    color="blue"
                                                    className="mb-2"
                                                >
                                                    {doctor.major_name}
                                                </Tag>
                                                <p>
                                                    <EnvironmentOutlined />{' '}
                                                    {doctor.location}
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
        </div>
    );
};
export default ViewDetailDoctor;
