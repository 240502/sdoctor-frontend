import { useState, useEffect } from 'react';
import { nestApi } from '../constants/api';
import { paginationState } from '../stores/paginationAtom';
import { useRecoilState } from 'recoil';
interface PaginationParams {
    filterOption?: any;
}

interface UseFetchDataWithPaginationProps<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    changePage: (page: number, pageSize: number) => void;
}

export const useFetchDataWithPaginationProps = <T,>(
    apiEndpoint: string,
    payload?: PaginationParams
): UseFetchDataWithPaginationProps<T> => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useRecoilState(paginationState);
    const changePage = (currentPageIndex: number, newPageSize: number) => {
        if (newPageSize !== pagination.pageSize) {
            setPagination({
                ...pagination,
                pageSize: newPageSize,
                pageIndex: 1,
            });
        } else {
            setPagination({ ...pagination, pageIndex: currentPageIndex });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await nestApi.post(apiEndpoint, {
                    ...payload,
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                });
                setData(res?.data?.data);
                setPagination({
                    ...pagination,
                    pageCount: res?.data?.pageCount,
                    totalItems: res?.data?.totalItems,
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Error fetching data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiEndpoint, pagination.pageIndex, pagination.pageSize, payload]);

    return {
        data,
        loading,
        error,
        changePage,
    };
};
