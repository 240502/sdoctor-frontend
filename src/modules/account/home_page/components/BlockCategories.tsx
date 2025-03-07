import { useNavigate } from 'react-router-dom';
import { Col, Image, Row } from 'antd';
import { baseURL } from '../../../../constants/api';
import { MajorService } from '../../../../services/majorService';
import { useEffect, useState } from 'react';
import { Major } from '../../../../models/major';
import { useRecoilState } from 'recoil';
import { searchDoctorOptionsGlobal } from '../../../../stores/doctorAtom';
export const BlockCategories = (): JSX.Element => {
    const [options, setOptions] = useRecoilState(searchDoctorOptionsGlobal);
    const navigate = useNavigate();
    const [majors, setMajors] = useState<Major[]>([]);
    const getMajors = async () => {
        try {
            const res = await MajorService.getCommonMajor();
            setMajors(res);
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
                        <Col
                            key={major.id}
                            span={4}
                            onClick={() => {
                                const newOptions = {
                                    ...options,
                                    majorId: major.id,
                                };
                                setOptions(newOptions);
                                navigate('/list/doctor');
                            }}
                        >
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
