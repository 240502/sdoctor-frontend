import { useEffect, useState } from 'react';
import { MajorService } from '../../../../services/majorService';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { MajorCards } from '../components/MajorCards';
import { Major } from '../../../../models/major';
import { useSetRecoilState } from 'recoil';
import { majorIdState } from '../../../../stores/majorAtom';

const ViewMajor = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(0);
    const [majors, setMajors] = useState<Major[]>([]);
    const setMajorId = useSetRecoilState(majorIdState);
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
    const changePage = (current: number, size: number) => {
        if (size !== pageSize) {
            setPageIndex(1);
            setPageSize(size);
        } else {
            setPageIndex(current);
        }
    };
    useEffect(() => {
        getMajors();
        window.scrollTo(0, 0);
    }, [pageIndex, pageSize]);
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
                <MajorCards
                    majors={majors}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    changePage={changePage}
                    setMajorId={setMajorId}
                />
            </div>
        </div>
    );
};
export default ViewMajor;
