import { Link } from 'react-router-dom';
import { Card, Col, Flex, Image, Row } from 'antd';
import { baseURL } from '../../../../constants/api';
import { MajorService } from '../../../../services/majorService';
import { useEffect, useState } from 'react';
import { Major } from '../../../../models/major';
export const BlockCategories = (): JSX.Element => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [majors, setMajors] = useState<Major[]>([]);
    const getMajors = async () => {
        try {
            const data = { pageIndex: pageIndex, pageSize: pageSize };
            const res = await MajorService.viewMajor(data);
            setMajors(res.data);
            setPageCount(res.pageCount);
        } catch (err: any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getMajors();
    }, []);
    return (
        <div className="row block-category mt-4">
            <Row className="category-list" gutter={[16, 16]}>
                {majors.map((major: Major) => {
                    return (
                        <Col span={4}>
                            <div className="category-item rounded border border-1  gutter-row ">
                                <Image
                                    preview={false}
                                    className="category-image rounded"
                                    src={baseURL + major.image}
                                ></Image>
                                <p className="category-name pb-0 text-center fw-bold">
                                    {major.name}
                                </p>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
