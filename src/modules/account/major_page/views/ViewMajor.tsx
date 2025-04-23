import { useEffect } from 'react';
import { Breadcrumb, Skeleton } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { MajorCards } from '../components/MajorCards';
import { useFetchSpecializationsWithPagination } from '../../../../hooks';
import ShowMoreComp from '../../../../components/ShowMoreComp';

const ViewMajor = () => {
    const { data, error, isFetching } = useFetchSpecializationsWithPagination({
        pageIndex: 1,
        pageSize: 8,
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

            <div className="specialization-list-container mt-4">
                <Skeleton active loading={isFetching}>
                    {error ? (
                        <p>{error.message}</p>
                    ) : (
                        data?.majors?.length > 0 && (
                            <>
                                <MajorCards
                                    majors={data?.majors}
                                    // changePage={changePage}
                                />

                                <ShowMoreComp></ShowMoreComp>
                            </>
                        )
                    )}
                </Skeleton>
            </div>
        </div>
    );
};
export default ViewMajor;
