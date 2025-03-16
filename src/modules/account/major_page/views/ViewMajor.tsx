import { useEffect, useState } from 'react';
import { Breadcrumb, Pagination } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { MajorCards } from '../components/MajorCards';
import { Major } from '../../../../models/major';
import { useFetchDataWithPaginationProps } from '../../../../hooks';

const ViewMajor = () => {
    // const [pagination, setPagination] = useRecoilState(paginationState);
    const [majors, setMajors] = useState<Major[]>([]);
    const apiEndpoint = '/major/view';
    const { data, loading, error } = useFetchDataWithPaginationProps<Major>(
        apiEndpoint,
        undefined
    );
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        setMajors(data);
    }, [data]);
    return (
        <div className="container home__content mt-4 mb-4">
            <Breadcrumb
                items={[
                    {
                        href: '/',
                        title: <HomeOutlined />,
                    },

                    {
                        title: `Danh sách chuyên khoa`,
                    },
                ]}
            />

            <div className="block__list__doctor mt-4">
                {loading ? (
                    <p>Đang tải dữ liệu ...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    data?.length > 0 && (
                        <>
                            <MajorCards
                                majors={majors}
                                // changePage={changePage}
                            />
                            {/* <section className="page d-flex justify-content-center align-items-center">
                                {pagination.pageCount > 0 ? (
                                    <Pagination
                                        showSizeChanger
                                        defaultCurrent={1}
                                        align="center"
                                        current={pagination.pageIndex}
                                        pageSize={pagination.pageSize}
                                        total={
                                            pagination.pageCount *
                                            pagination.pageSize
                                        }
                                        pageSizeOptions={['4', '8', '12', '16']}
                                        onChange={(
                                            current: number,
                                            size: number
                                        ) => {
                                            changePage(current, size);
                                        }}
                                    />
                                ) : (
                                    <></>
                                )}
                            </section> */}
                        </>
                    )
                )}
            </div>
        </div>
    );
};
export default ViewMajor;
