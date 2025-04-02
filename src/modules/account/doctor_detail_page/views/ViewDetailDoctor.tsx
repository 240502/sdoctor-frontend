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
    Skeleton,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Doctor } from '../../../../models/doctor';
import { baseURL } from '../../../../constants/api';
import parse from 'html-react-parser';
import { useSetRecoilState } from 'recoil';
import { doctorState } from '../../../../stores/doctorAtom';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../../../../services';
import socket from '../../../../socket';
import { Comment } from '../../../../models/comment';
import { useFetchDoctorDetail } from '../../../../hooks';
import { BlockComment } from '../components/BlockComment';
import BlockCommonDoctors from '../components/BlockCommonDoctors';
type DataParams = {
    id: string;
};
const ViewDetailDoctor = () => {
    const navigate = useNavigate();
    const { id } = useParams<DataParams>();
    const [doctor, setDoctor] = useState<Doctor>({} as Doctor);
    const [totalComment, setTotalComment] = useState<number>(0);
    const setDoctorGlobal = useSetRecoilState(doctorState);
    const [comments, setComments] = useState<Comment[]>([]);
    const [pageComment, setPageComment] = useState<number>(1);
    const [pageCommentSize, setPageCommentSize] = useState<number>(4);
    const [pageCommentCount, setPageCommentCount] = useState<number>(0);
    const { data, error, isFetching } = useFetchDoctorDetail(Number(id));
    const onButtonMoreClick = () => {
        if (pageComment < pageCommentCount) {
            setPageComment(pageComment + 1);
        }
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin chi tiết',
            children: <>{parse(String(data?.introduction))}</>,
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

    const getCommentByDoctorId = async (doctorId: number) => {
        try {
            const data = {
                pageIndex: pageComment,
                pageSize: pageCommentSize,
                doctorId: doctorId,
            };
            const res = await commentService.getCommentByUserId(data);
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
        console.log('data', data);
    }, [data]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // useEffect(() => {
    //     getCommonDoctor();
    // }, [pageIndex, pageSize]);
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
            <Skeleton active loading={isFetching}>
                {error ? (
                    <p className="text-center fw-bold">{error.message}</p>
                ) : (
                    <Row className="mt-4 justify-content-between" gutter={24}>
                        <Col
                            span={16}
                            className="doctor-info border rounded p-3"
                        >
                            <Flex className="flex-row">
                                <Flex className="col-9">
                                    <div className="doctor-image col-2">
                                        <Image
                                            style={{ width: '80%' }}
                                            preview={false}
                                            className="rounded-circle"
                                            src={
                                                data?.image?.includes(
                                                    'cloudinary'
                                                )
                                                    ? String(data.image)
                                                    : baseURL + data?.image
                                            }
                                        ></Image>
                                    </div>
                                    <div className="info ms-3">
                                        <h5 className="doctor-name">
                                            {data?.title} {data?.fullName}
                                        </h5>
                                        <Tag color="blue">
                                            {data?.majorName}
                                        </Tag>
                                        <p className="doctor-location mt-2">
                                            <EnvironmentOutlined className="me-2"></EnvironmentOutlined>
                                            {data?.location}
                                        </p>

                                        <div className="mt-3">
                                            <Button
                                                className="border-primary text-primary button-booking-now"
                                                onClick={() => {
                                                    navigate(
                                                        '/booking-appointment'
                                                    );
                                                    setDoctorGlobal(doctor);
                                                }}
                                            >
                                                Đặt lịch khám
                                            </Button>
                                        </div>
                                    </div>
                                </Flex>
                                <div className="col-3 text-end">
                                    {data?.averageStar !== null && (
                                        <Tag
                                            color="default"
                                            className="fs-6 rounded border-0 p-32d-inline-block"
                                        >
                                            <StarFilled className="text-warning" />
                                            <span className="fw-bold">
                                                {data?.averageStar
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
                                    {parse(String(data?.summary))}
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
                            <BlockCommonDoctors doctorId={Number(id)} />
                        </Col>
                    </Row>
                )}
            </Skeleton>
        </div>
    );
};
export default ViewDetailDoctor;
