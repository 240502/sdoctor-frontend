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
import { useEffect, useMemo, useState } from 'react';
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
    const [totalComment, setTotalComment] = useState<number>(0);
    const setDoctorGlobal = useSetRecoilState(doctorState);
    const [pageComment, setPageComment] = useState<number>(1);
    const [pageCommentSize, setPageCommentSize] = useState<number>(4);
    const [pageCommentCount, setPageCommentCount] = useState<number>(0);

    const { data, error, isFetching } = useFetchDoctorDetail(Number(id));

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin chi tiết',
            children: <>{parse(String(data?.introduction))}</>,
        },
        {
            key: '2',
            label: 'Đánh giá',
            children: <BlockComment doctorId={Number(id)} />,
        },
    ];

    const handleOnNewComment = () => {
        socket?.on('newComment', (newComment: Comment) => {
            // getCommentByDoctorId(Number(newComment.doctorId));
        });
    };
    useEffect(() => {
        handleOnNewComment();
        console.log('data', data);
    }, [data]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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
                                            {data?.titleName} {data?.fullName}
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
                                                    // setDoctorGlobal(doctor);
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
