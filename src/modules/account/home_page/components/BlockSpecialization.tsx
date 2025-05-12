import { useNavigate } from 'react-router-dom';
import { Col, Image, Row, Skeleton } from 'antd';
import { baseURL } from '../../../../constants/api';
import { Major } from '../../../../models/major';
import { useFetchCommonSpecialization } from '../../../../hooks';
import { useRecoilState } from 'recoil';
import { doctorFilterOptions } from '../../../../stores';
const BlockSpecialization = (): JSX.Element => {
    const navigate = useNavigate();
    // const { data, error, isFetching } = useFetchCommonSpecialization();
    const [doctorOptions, setDoctorOptions] =
        useRecoilState(doctorFilterOptions);
    return (
        <div className="row block-category mt-4">
            {/* <Skeleton active loading={isFetching}>
                <Row className="category-list" gutter={[16, 16]}>
                    {error ? (
                        <p className="fw-bold text-center mt-4 w-100">
                            {error.message}
                        </p>
                    ) : (
                        data &&
                        data?.map((major: Major) => {
                            return (
                                <Col
                                    key={major.id}
                                    span={4}
                                    onClick={() => {
                                        setDoctorOptions({
                                            ...doctorOptions,
                                            majorIds: [major.id],
                                        });
                                        const queryParams =
                                            new URLSearchParams();
                                        queryParams.append(
                                            'majorId',
                                            major.id.toString()
                                        );
                                        navigate(
                                            `/list/doctor?${queryParams.toString()}`
                                        );
                                    }}
                                >
                                    <div className="category-item rounded border border-1  gutter-row ">
                                        <Image
                                            preview={false}
                                            className="category-image rounded"
                                            src={baseURL + major.image}
                                        ></Image>
                                        <p className="category-name pb-0 text-center fw-bold fs-md-5">
                                            {major.name}
                                        </p>
                                    </div>
                                </Col>
                            );
                        })
                    )}
                </Row>
            </Skeleton> */}
        </div>
    );
};
export default BlockSpecialization;
