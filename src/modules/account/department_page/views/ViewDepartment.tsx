import { useEffect, useState } from 'react';
import { Breadcrumb, Pagination, Skeleton } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { DepartmentCards } from '../components/DepartmentCards';
import { useFetchDepartmentByPagination } from '../../../../hooks/department/useDepartment';

const ViewDepartment = () => {
    
    const [options, setOptions] = useState<{ pageIndex: number, pageSize: number, name: string }>(
        {pageIndex: 1, pageSize:16,name:""}
    )
    const { data, isError, error, isFetching } = useFetchDepartmentByPagination(options);
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(options);
        
    }, []);

    useEffect(() => {
        console.log(data);
        
    },[data])
   
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
                    {isError ? (
                        <p>{error.message}</p>
                    ) : 
                        
                            <>
                                <DepartmentCards
                                    departments={data?.departments}
                                />
                                <Pagination
                                    align='center'
                                    className='mt-3'
                                    current={options.pageIndex}
                                    pageSize={options.pageSize}
                                    showSizeChanger
                                    pageSizeOptions={["16",'24','32']}
                                    total={options.pageSize * data?.pageCount}
                                    onChange={(curr:number,size:number) => {
                                        if (size !== options.pageSize) {
                                            setOptions({...options,pageIndex:1,pageSize:size})
                                        }    
                                        else {
                                            setOptions({...options,pageIndex:curr})
                                        }
                                    }}
                                />
                            </>
                    }
                </Skeleton>
            </div>
        </div>
    );
};
export default ViewDepartment;
