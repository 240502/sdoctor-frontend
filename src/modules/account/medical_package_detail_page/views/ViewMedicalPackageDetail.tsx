import { DollarOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Image, Row, Col, Divider, Tabs, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchMedicalPackageById } from '../../../../hooks';
import { BlockComment, BlockDescription } from '../components';

type DataParams = {
    id: string;
};
const ViewDetailService = () => {
    const { id } = useParams<DataParams>();
    const { data, error, isFetching } = useFetchMedicalPackageById(Number(id));
    useEffect(() => {
        console.log('data', data);
    }, [data]);

    useEffect(() => {
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
                <Skeleton active loading={isFetching}>
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
                            src={data?.coverImage}
                        />
                    </div>
                </Skeleton>

                <Row className="clinic-info align-items-center" gutter={24}>
                    <Skeleton active loading={isFetching}>
                        <Col
                            span={4}
                            className="rounded-5 clinic-image text-center"
                        >
                            <Image
                                src={data?.image}
                                preview={false}
                                width={128}
                                className="rounded-5 shadow"
                            ></Image>
                        </Col>
                        <Col span={20} className="pt-3">
                            <h5>{data?.name}</h5>
                            <p className="price">
                                <DollarOutlined />{' '}
                                <span className="text-success fw-bold">
                                    {' '}
                                    {data?.price?.toLocaleString()} VNĐ
                                </span>
                            </p>
                        </Col>
                    </Skeleton>
                </Row>
            </div>
            <Divider className="divider" />
            <div className="container">
                <Tabs
                    // onChange={(key: string) => {
                    //     setSelectedKey(key);
                    // }}
                    className="text-start"
                    // onClick={handleChangeMenu}
                    items={[
                        {
                            key: '1',
                            label: 'Thông tin cơ bản',
                            children: (
                                <>
                                    {data?.id && (
                                        <BlockDescription
                                            service={data}
                                            isFetching={isFetching}
                                        />
                                    )}
                                </>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Đánh giá',
                            children: (
                                <>
                                    {data?.id && (
                                        <BlockComment
                                            commentableId={Number(data?.id)}
                                        />
                                    )}
                                </>
                            ),
                        },
                    ]}
                ></Tabs>
            </div>
        </div>
    );
};
export default ViewDetailService;
