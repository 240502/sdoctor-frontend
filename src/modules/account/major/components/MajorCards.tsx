import { Pagination, Flex, Card } from 'antd';
import { Major } from '../../../../models/major';
import { baseURL, nestJsServiceUrl } from '../../../../constants/api';
import { useNavigate } from 'react-router-dom';

export const MajorCards = ({
    majors,
    pageCount,
    pageIndex,
    pageSize,
    changePage,
    setOptionsGlobal,
    optionsGlobal,
}: any) => {
    const navigate = useNavigate();
    return (
        <>
            <Flex wrap>
                {majors?.length > 0 ? (
                    <>
                        {majors?.map((major: Major) => {
                            return (
                                <div
                                    className="col-3 ps-2 pe-2 mb-3"
                                    key={major.id}
                                >
                                    <Card
                                        className="shadow text-center"
                                        cover={
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    navigate('/list/doctor');
                                                    setOptionsGlobal({
                                                        ...optionsGlobal,
                                                        majorId: major.id,
                                                    });
                                                }}
                                                src={
                                                    nestJsServiceUrl +
                                                    major?.image
                                                }
                                            ></img>
                                        }
                                    >
                                        <h6
                                            onClick={() => {
                                                navigate('/list/doctor');
                                                setOptionsGlobal({
                                                    ...optionsGlobal,
                                                    majorId: major.id,
                                                });
                                            }}
                                            style={{
                                                height: '50px',
                                                maxHeight: '50px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {major.name}
                                        </h6>
                                    </Card>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <p className="fs-5 fw-bold text-center">
                        Không có bác sĩ nào
                    </p>
                )}
            </Flex>
            <section className="page d-flex justify-content-center align-items-center">
                {pageCount > 1 ? (
                    <Pagination
                        showSizeChanger
                        defaultCurrent={1}
                        align="center"
                        current={pageIndex}
                        pageSize={pageSize}
                        total={pageCount * pageSize}
                        pageSizeOptions={['4', '8', '12', '16']}
                        onChange={(current: number, size: number) => {
                            changePage(current, size);
                        }}
                    />
                ) : (
                    <></>
                )}
            </section>
        </>
    );
};
